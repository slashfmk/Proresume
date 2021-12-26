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
    level: Yup.string()
        .required('Required'),
});

interface MyFormValues {
    title: string;
    level: string;
}

const Skills: React.FC<any> = () => {


    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const param = useParams();
    const educationQuery = useQuery('skill', async () => await axios.get(`${apiUrl}/skill/resume/${param.resumeId}`));
    const [openModal, setOpenModal] = useState(false);

    const mutation = useMutation(async (login: MyFormValues) => {
        return await axios.post(`${apiUrl}/skill/${param.resumeId}`, login);
    }, ({
        onSuccess: async (data, variables) => {
            await queryClient.invalidateQueries('skill');
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

    const initialValues: MyFormValues = {title: '', level: ''};

    return <div className={"home--split"}>

        <Nav/>
        <div className="main__container">

            <div className={"title--xxx gen_title "}>Skill | Resume {param.resumeId}</div>

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
                                                                         dateLast={item.end_date}>{item.level}</Element>)}

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
                                level: values.level.toString(),
                            });
                        }}
                        validationSchema={SignInSchema}>
                        {({errors, touched}) => (
                            <Form className="form">

                                <h1>Add Skill field</h1>

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

                                <Field className="field" type="text" id="level" name="level"
                                       placeholder="Skill"/>
                                {errors.level && touched.level ?
                                    <div className="error_field">{errors.level}</div> : null}

                                <div className="container container--2">
                                    <Button title={"Add a skill"} type={"submit"}/>
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

export default Skills;
