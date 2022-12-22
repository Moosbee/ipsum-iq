import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {BrowserRouter as Router, Navigate, Route} from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Mainpage = () => {

    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    useEffect(()=> {
        Axios.get('http://localhost:3001/Mainpage').then((Response) => {
    
        if(Response.data.LoggedIn) {
          console.log("LOGGED IN");
          navigate("/Mainpage");
    
        }
        else {
          console.log("LOGGED out");
          navigate("/");
        }
            
        });
      }, []);


    return (
        <>
            <h1>mainpage</h1>
        </>
    );
};

export default Mainpage;
