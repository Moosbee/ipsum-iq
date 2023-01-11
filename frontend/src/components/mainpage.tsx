import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Mainpage = () => {

  const navigate = useNavigate();
  const Light = false;

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get('http://localhost:3001/Mainpage').then((Response) => {

      if (Response.data.LoggedIn) {
        console.log("LOGGED IN");
        navigate("/Mainpage");

      }
      else if (!Response.data.LoggedIn) {
        console.log("LOGGED out");
        navigate("/");
      }

    });
  }, []);



  function InsertIntoDB() {
    Axios.post('http://localhost:3001/Entries').then((Response) => {

        if(Response.data.LoggedIn) {
          
        }
        else if (!Response.data.LoggedIn) {
          console.log("LOGGED out");
          navigate("/");
        }
    });
  }


  return (
    <>
      <div className=" bg-gradient-to-br from-purple-600 to-blue-500">
        <div className="grid place-items-center h-screen">
          <h1>mainpage</h1>

          <button onClick={() => InsertIntoDB()}>an</button>
          <br />
          <button onClick={() => console.log("test")}>aus</button>

        </div>
      </div>
    </>
  );
};

export default Mainpage;
