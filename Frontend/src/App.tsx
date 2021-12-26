import React from "react";
import {Route, Routes} from "react-router-dom";
import axiosConfig from "./utils/axiosConfig";

import SignIn from "../src/pages/SignIn";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Education from "./pages/Education";
import Experience from "./pages/Experience";
import Skills from "./pages/Skills";

axiosConfig();
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
const App: React.FC<any> = () => {

    return (

        <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/education/:resumeId" element={<Education/>}/>
            <Route path="/experience/:resumeId" element={<Experience/>}/>
            <Route path="/skills/:resumeId" element={<Skills/>}/>
        </Routes>

    );
};

export default App;

