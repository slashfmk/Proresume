import React, {useEffect} from "react";

import "../css/pages_style/home.scss";
import {Link, useNavigate,} from "react-router-dom"
import {
    Formik,
    Form,
    Field,

} from 'formik';

import * as Yup from 'yup';

import storage from "../utils/storage";
import {useMutation} from "react-query";
import axios from "axios";
import {apiUrl} from "../api/apiUrl";
import FormContainer from "../components/FormContainer";
import Button from "../components/Button";


const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
});

interface MyFormValues {
    email: string;
    password: string;
}

const SignIn: React.FC = (props) => {

    const navigate = useNavigate();

    const mutation = useMutation(async (login: MyFormValues) => {
        return await axios.post(`${apiUrl}/auth/signin/`, login);
    }, ({
        onSuccess: async (data, variables) => {
            await storage.saveToken(data.data);
            navigate("/home");
        },
        onError: (error, variable) => {
            console.log(error);
        }
    }))



    const initialValues: MyFormValues = {email: '', password: ''};

    // @ts-ignore
    return (
        <div className="home--sio">

            <Formik
                initialValues={initialValues}
                onSubmit={async (values, actions) => {

                    await mutation.mutateAsync({
                        email: values.email.toString(),
                        password: values.password.toString()
                    });
                }}
                validationSchema={SignInSchema}>
                {({errors, touched}) => (
                    <FormContainer title={"Sign In"} >
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

                        <Field className="field" id="email" name="email" placeholder="Email"/>
                        {errors.email && touched.email ? <div className="error_field">{errors.email}</div> : null}
                        <Field className="field" type="password" id="password" name="password" placeholder="Password"/>
                        {errors.password && touched.password ?
                            <div className="error_field">{errors.password}</div> : null}
                        <div className="container container--2">
                            <Button title={"Sign In"} type="submit" />
                            <div className="legend"><Link to="/signup">Don't have an account? Sign up</Link></div>
                        </div>
                    </Form>
                    </FormContainer>

                )}

            </Formik>
        </div>

    );
};

export default SignIn;
