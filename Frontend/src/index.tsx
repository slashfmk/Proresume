import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {IconContext} from "react-icons";
import {QueryClientProvider, QueryClient} from 'react-query';

import axiosConfig from "./utils/axiosConfig";

const queryClient = new QueryClient();
axiosConfig();

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <IconContext.Provider value={{color: "grey", className: "global-class-name"}}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </IconContext.Provider>
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
