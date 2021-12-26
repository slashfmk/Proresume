import React from 'react';
import '../css/pages_style/home.scss';
import {useFormik} from "formik";

import {
    Formik,
    Form,
    Field,
} from 'formik';

import {Link} from 'react-router-dom';

import * as Yup from 'yup'
import axios from "axios";
import {useMutation} from "react-query";
import {apiUrl} from "../api/apiUrl";
import FormContainer from "../components/FormContainer";
import Button from "../components/Button";


interface MyFormValues {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    repeat_password: string;
}

const SignUpSchema = Yup.object().shape({
    firstname: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    lastname: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(/(?=.*[a-z])+(?=.*[A-Z])+(?=.*[0-9])+/, 'Invalid password! at least 1 Uppercase letter, 1 lowercase letter and 1 digit'),
    repeat_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const SignUp: React.FC = () => {

    const initialValues: MyFormValues = {email: '', password: '', firstname: '', lastname: '', repeat_password: ''};

    const mutation = useMutation(async (userInfo: MyFormValues) => axios.post(`${apiUrl}/auth/signup/`, userInfo),
        ({
            onSuccess: data => {
                console.log(data);
            },
            onError: error => {
                console.log(error);
            }
        })
    );

    return (

        <div className={"home--sio"}>
            <Formik
                initialValues={initialValues}
                validationSchema={SignUpSchema}
                onSubmit={async (values, actions) => {
                    await mutation.mutateAsync({
                        firstname: values.firstname.toString(),
                        lastname: values.lastname.toString(),
                        email: values.email.toString(),
                        password: values.password.toString(),
                        repeat_password: values.repeat_password.toString()
                    })
                    // actions.setSubmitting(false);
                }}>

                {({errors, touched}) => (
                    <FormContainer title={"Sign Up"}>
                        <Form className="form">

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

                            <div className="container container--2">

                                <div>
                                    <Field className="field" id="firstname" name="firstname" placeholder="First Name"/>
                                    {errors.firstname && touched.firstname ?
                                        <div className="error_field">{errors.firstname}</div> : null}
                                </div>
                                <div>
                                    <Field className="field" id="lastname" name="lastname" placeholder="Last Name"/>
                                    {errors.lastname && touched.lastname ?
                                        <div className="error_field">{errors.lastname}</div> : null}
                                </div>
                            </div>

                            <Field className="field" id="email" name="email" placeholder="Email"/>
                            {errors.email && touched.email ? <div className="error_field">{errors.email}</div> : null}

                            <div className="container container--2">
                                <div>
                                    <Field type="password" className="field" id="password" name="password"
                                           placeholder="Password"/>
                                    {errors.password && touched.password ?
                                        <div className="error_field">{errors.password}</div> : null}
                                </div>
                                <div>
                                    <Field type="password" className="field" id="repeat_password" name="repeat_password"
                                           placeholder="Repeat Password"/>
                                    {errors.repeat_password && touched.repeat_password ?
                                        <div className="error_field">{errors.repeat_password}</div> : null}
                                </div>
                            </div>

                            <div className="container container--2">
                                <Button title={"Create Account"}/>
                                <div className="legend"><Link to="/">Have an account? Sign In</Link></div>
                            </div>
                        </Form>
                    </FormContainer>)}

            </Formik>
        </div>
    )
}

export default SignUp;
