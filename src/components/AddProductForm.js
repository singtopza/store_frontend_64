import React,{useState} from 'react';
import {useFormik} from "formik";
import * as yup from "yup";
import {Container, Row, Button, Form, FormGroup, Label, Input, Alert, FormText, Progress} from "reactstrap";
import axios from "axios";
import { storage } from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function AddProductForm() {
    const initProductState = {  //ค่าเริ่มต้นตัวแปล
        name: "",
        category : "",
        price : "",
        tags : [],
        file : "",
    };
   // const [product, setProduct] = useState(initProductState);  //กำหนดค่าเริ่มต้นของ state
    const [submitted,setSubmitted] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadFileToFirebase = async (file) => {
        //Prepare unique file name
        const userId = "001";
        const timestamp = Math.floor(Date.now() / 1000);
        const newName = userId + "_" + timestamp;

        //uploading file
        const storageRef = ref(storage, `images/${newName}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        //get URL
        await uploadTask.on(
            "state_changed",
            (snapshot) => {
                const uploadProgress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(uploadProgress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                });
            }
        );
    };

    const FILE_SIZE = 2000 * 1024;
    const SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/gif",
    ];
    const formik = useFormik({
        initialValues:initProductState,    //กรณีรีเซ็ตกำหนดค่าเริ่มต้น
        validationSchema:yup.object().shape({
            name:yup.string().required("กรุณากรอกข้อมูล"),
            category:yup.string().required("กรุณากรอกข้อมูล"),
            price:yup.number("กรุณากรอกตัวเลข").positive("ไม่สามารถติดลบได้").required("กรุณากรอกราคา"),
            tags:yup.string(),
            file: yup.mixed().test("fileSize","ไฟล์มีขนาดใหญ่เกินไป", (file)=>{
                if(file){
                    return file?.size <= FILE_SIZE;
                }else{
                    return true;
                }
            })
            .test('filetype',"อัพโหลดได้เฉพาะรูปภาพเท่านั้น", (file)=>{
                if(file){
                    return SUPPORTED_FORMATS.includes(file?.type);
                }else{
                    return true;
                }
            })
        }),      
        onSubmit: () =>{   
            if (formik.values.file) {
                console.log("Uploadding image....");
                uploadFileToFirebase(formik.values.file);
            } else {
                saveProduct("");
            }
            //saveProduct();
        }
    });

    /*const handleInputChange = (event) =>{
        let {name, value} = event.target;
        if(name=="tags"){
            value = value.split(",")
        }
        setProduct({...product, [name]:value});   //... = Specoperater
    };*/
    const saveProduct = () =>{
        const param = {
            name: formik.values.name ,
            category:formik.values.category ,
            price:formik.values.price,
            tags:formik.values.tags,
            imageURL:URL,
        }
        //call API
        axios.post("https://product-api-027.herokuapp.com/api/products/", param).then((response)=>{
            console.log(response.data);
            //setProduct(initProductState);
            setSubmitted(true);
        }).catch((error)=>{
            console.log(error);
        });
    }
    
    const newProduct = () =>{
        //setProduct(initProductState);
        setSubmitted(false);
    }
    return (
        <Container>
            <Row>
                <h3>Add New Product</h3>
                </Row>
                {submitted ? (<>
                    <Alert color='success'>You Have submitted successfuly</Alert>
                    <Button className='btn btn-success' onClick={newProduct}>Add New Product</Button>
                </>):(<> <Form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <Label for='productName'>ProductName</Label>
                        <Input type='text' name='name' id='productName' value={formik.values.name || ""} onChange={formik.handleChange} placeholder='Ente Product Name' />
                        {
                            formik.errors.name && formik.touched.name && (
                                <p>{formik.errors.name}</p>
                            )
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label for='productCategory'>ProductCategory</Label>
                        <Input type='text' name='category' id='productCategory' value={formik.values.category || ""} onChange={formik.handleChange} placeholder='Ente Product Category' />
                        {
                            formik.errors.category && formik.touched.category && (
                                <p>{formik.errors.category}</p>
                            )
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label for='productPrice'>ProductPrice</Label>
                        <Input type='text' name='price' id='productPrice' value={formik.values.price || ""} onChange={formik.handleChange} placeholder='Ente Product Price' />
                        {
                            formik.errors.price && formik.touched.price && (
                                <p>{formik.errors.price}</p>
                            )
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label for='productTags'>ProductTags</Label>
                        <Input type='text' name='tags' id='productTags' value={formik.values.tags || ""} onChange={formik.handleChange} placeholder='Ente Product Tags' />
                        {
                            formik.errors.tags && formik.touched.tags && (
                                <p>{formik.errors.tags}</p>
                            )
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label for="fileupload">Product Image</Label>
                        <Input type="file" name="file" onChange={(event)=>{
                            formik.setFieldValue("file", event.currentTarget.files[0]);
                        }} />
                        <FormText color='muted'>
                            รองรับเฉพาะไฟล์ภาพขนาดน้อยกว่า 2MB
                        </FormText>
                        {
                            formik.errors.file && formik.touched.file && (
                                <p>{formik.errors.file}</p>
                            )
                        }
                        {progress != 0 && (
                            <Progress value={progress} max="100" animated>
                                {progress} %
                            </Progress>
                        )} 
                    </FormGroup>
                    <Button className="btn btn-success" >Add New Product</Button>
                </Form>
            
                </>)}
        </Container>
    )
}

export default AddProductForm