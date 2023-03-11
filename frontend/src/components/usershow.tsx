import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState, Fragment } from 'react';
import  Axios  from "axios";



const ShowUser = () => {
    const [isUser, setUser] = useState()
    Axios.defaults.withCredentials = true;

    useEffect(() => {

        Axios.get("http://localhost:80/Mainpage").then((Response) => {

            if(Response.data.LoggedIn) {
                setUser(Response.data.User);
            }
        })
    
    
    
    
    }, []);

      
    return(

        <span className="ml-3 text-xs">Logged in as: {isUser}</span>

    )




};
export default ShowUser;