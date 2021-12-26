import React, {useEffect, useState} from 'react';
import '../css/pages_style/education.scss';

import Nav from '../pages/Nav';
import Element from "../components/Element";
import {FaPlusCircle, FaStopCircle} from "react-icons/fa";
import {useParams, useNavigate} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {apiUrl} from "../api/apiUrl";
import * as Yup from "yup";
import storage from "../utils/storage";
import Modal from "react-modal";
import {Field, Form, Formik} from "formik";
import Button from "../components/Button";


const SignInSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    description: Yup.string()
        .required('Required'),
    start_date: Yup.string()
        .required('Required'),
    end_date: Yup.string()
        .required('Required'),
});

interface MyFormValues {
    title: string;
    description: string;
    start_date: string;
    end_date: string
}

const Experience: React.FC<any> = () => {


    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const param = useParams();
    const educationQuery = useQuery('experience', async () => await axios.get(`${apiUrl}/experience/resume/${param.resumeId}`));
    const [openModal, setOpenModal] = useState(false);

    const mutation = useMutation(async (login: MyFormValues) => {
        return await axios.post(`${apiUrl}/experience/${param.resumeId}`, login);
    }, ({
        onSuccess: async (data, variables) => {
            await queryClient.invalidateQueries('experience');
            setOpenModal(false);
        },
        onError: (error, variable) => {
            console.log(error);
        }
    }));

    useEffect(() => {
        if (!storage.getToken()) {
            navigate('/');
        } else if (!param.resumeId) {
            navigate('/home');
        }
    }, []);


    const initialValues: MyFormValues = {title: '', description: '', start_date: '', end_date: ''};

    return <div className={"home--split"}>

        <Nav/>
        <div className="main__container">

            <div className={"title--xxx gen_title "}>Experience | Resume {param.resumeId}</div>

            <div className="content_wrapper">

                {
                    educationQuery.isError && <div className={"error_container"}>{
                        //@ts-ignore
                        educationQuery.error.response.data.message
                    }</div>
                }

                {
                    // educationQuery.isSuccess && <div className={"success_container"}>{
                    //     //@ts-ignore
                    //     educationQuery.data.data.message
                    // }</div>
                }

                {
                    //@ts-ignore
                    educationQuery.isSuccess &&
                    educationQuery.data.data.map((item: any) => <Element title={item.title}
                                                                         dateFrom={item.start_date}
                                                                         dateLast={item.end_date}>{item.description}</Element>)}

                <div className="margin--xxxx">
                    <button className="button" onClick={() => setOpenModal(true)}>
                        <FaPlusCircle className="logo--xxx"/>
                    </button>
                </div>

            </div>


            {/*    modal*/}
            <Modal
                isOpen={openModal}
                onRequestClose={() => setOpenModal(false)}
                style={{
                    overlay: {backgroundColor: 'rgba(0, 0, 0, .5)',},
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
                                description: values.description.toString(),
                                start_date: values.start_date.toString(),
                                end_date: values.end_date.toString()
                            });
                        }}
                        validationSchema={SignInSchema}>
                        {({errors, touched}) => (
                            <Form className="form">

                                <h1>Add an Education field</h1>

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

                                <Field className="field" type="date" id="start_date" name="start_date"
                                       placeholder="start_date"/>
                                {errors.start_date && touched.start_date ?
                                    <div className="error_field">{errors.start_date}</div> : null}


                                <Field className="field" type="date" id="end_date" name="end_date"
                                       placeholder="end_date"/>
                                {errors.start_date && touched.start_date ?
                                    <div className="error_field">{errors.end_date}</div> : null}

                                <div className="container container--2">
                                    <Button title={"Add Education field"} type={"submit"}/>
                                </div>
                            </Form>
                        )}

                    </Formik>
                    {/*    #end content*/}
                </div>

            </Modal>
            {/*    modal*/}

        </div>
    </div>
}

export default Experience;
