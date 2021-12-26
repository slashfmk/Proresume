import React, {useEffect, useState} from "react";
import "../css/pages_style/home.scss";
import CardOverview from "../components/CardOverview";
import {FaPlusCircle, FaStopCircle} from 'react-icons/fa';
import {useQueryClient, useQuery, useMutation} from "react-query";

import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {apiUrl} from "../api/apiUrl";
import {Field, Form, Formik} from "formik";
import Modal from 'react-modal';

import * as Yup from 'yup'
import Button from "../components/Button";
import storage from "../utils/storage";
import jwtDecode from 'jwt-decode';


interface FormValues {
    title: string;
    description: string;
    date: string;
}

// Form stuff
const initialValue: FormValues = {title: '', description: '', date: ''};
const Schema = Yup.object().shape({
    title: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    date: Yup.string().required('Required'),
});


Modal.setAppElement('#root');

const SignInSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    description: Yup.string()
        .required('No password provided.')
        .min(8, 'Description must be at least 8 chars')
});

interface MyFormValues {
    title: string;
    description: string;
}

const Home: React.FC = () => {

    const [openModal, setOpenModal] = useState(false);
    const queryClient = useQueryClient();
    const resumeQuery = useQuery('resumes', async () => await axios.get(`${apiUrl}/resume`));
    const navigate = useNavigate();

    useEffect(() => {
        if (!storage.getToken()) {
            navigate('/');
        }
    }, []);


    const mutation = useMutation(async (res: MyFormValues) => {
        return await axios.post(`${apiUrl}/resume/`, res);
    }, ({
        onSuccess: async (data, variables) => {
           // navigate("/home");
            await queryClient.invalidateQueries('resumes');
        },
        onError: (error, variable) => {
            console.log(error);
        }
    }));

    useEffect(() => {

        // @ts-ignore
        console.log(jwtDecode(storage.getToken()))
    }, [])

    const initialValues: MyFormValues = {title: '', description: ''};


    return (
        <>
            <div className="home">
                <div className="middle_container">
                    <h1 className="title--xxxx">{
                        //@ts-ignore
                        jwtDecode(storage.getToken()).firstname
                    }'s resumes</h1>
                    <h2 className="subtitle">So far, you have {
                        //@ts-ignore
                        resumeQuery.isSuccess ? resumeQuery.data.data.length : 0
                    } resumes</h2>
                    <h3 className="text-regular">Select a resume or create a new one</h3>

                    <div className="section-auto">
                        {
                            resumeQuery.isError && <div className={"error_container"}>{
                                //@ts-ignore
                                resumeQuery.error.response.data.message
                            }</div>
                        }

                        {
                            resumeQuery.isSuccess && resumeQuery.data.data.map((item: any) =>
                                <CardOverview editLink={`/education/${item.resume_id}`} onClickPrint={() => alert(`Printing is ready for resume ${item.resume_id}`)}
                                              title={item.title} date={item.date} id={item.resume_id}/>
                            )
                        }
                    </div>
                    <div className="margin--xxxx">
                        <button className="button" onClick={() => setOpenModal(true)}>
                            <FaPlusCircle className="logo--xxx"/>
                        </button>

                    </div>

                </div>

            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={() => setOpenModal(false)}
                style={{
                    overlay: {backgroundColor: 'rgba(0, 0, 0, .5)'},
                    content: {
                        width: '500px', maxHeight: '550px', position: 'relative',
                        top: '20%',
                        left: '50%',
                        right: "50%",
                        bottom: '50%',
                    }
                }}>

                <FaStopCircle style={{fontSize: '27px'}} onClick={() => setOpenModal(false)}>Close</FaStopCircle>
                <div>
                    {/*     content*/}
                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values, actions) => {

                            await mutation.mutateAsync({
                                title: values.title.toString(),
                                description: values.description.toString()
                            });
                        }}
                        validationSchema={SignInSchema}>
                        {({errors, touched}) => (
                            <Form className="form">

                                <h1>Add new resume</h1>

                                {
                                    mutation.isError && <div className={"error_container"}>{
                                        //@ts-ignore
                                        mutation.error.response.data.message
                                    }</div>
                                }

                                {
                                    mutation.isSuccess && <div className={"success_container"}>{
                                        //@ts-ignore
                                        mutation.data.data.message
                                    }</div>
                                }

                                <Field className="field" id="title" name="title" placeholder="Title"/>
                                {errors.title && touched.title ?
                                    <div className="error_field">{errors.title}</div> : null}
                                <Field className="field" type="text" id="description" name="description"
                                       placeholder="Description"/>
                                {errors.description && touched.description ?
                                    <div className="error_field">{errors.description}</div> : null}
                                <div className="container container--2">
                                    <Button title={"Create resume"} type={"submit"}/>
                                </div>
                            </Form>
                        )}

                    </Formik>
                    {/*    #end content*/}
                </div>

            </Modal>


        </>
    );
};

export default Home;
