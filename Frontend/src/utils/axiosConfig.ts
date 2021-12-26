
import axios from 'axios';
import tokenStorage from './storage';

const axiosDefault = () =>  {
    const token =  tokenStorage.getToken();
    try{
        if(!token) return null;
        // @ts-ignore
        axios.defaults.headers.common["x-auth"] = token;
    }catch (e) {
        console.log(e);
    }
}

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    const token = tokenStorage.getToken();
    // @ts-ignore
    config.headers.Authorization =  token;
    return config;
});

// @ts-ignore
axios.interceptors.response.use(null, error => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    if(expectedError){
    }

    return Promise.reject(error);
});

export default axiosDefault;
