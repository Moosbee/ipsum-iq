import React, { useEffect, useState } from "react";
import Axios from 'axios';
import {BrowserRouter as Router, Navigate, Route} from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Login(props: any) {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [LoginStatus, setLoginStatus] = useState("");

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  function PostLogin() {
    Axios.post('http://localhost:3001/login', {
      name: username,
      password: password
    }).then((Response) => { 
      if(Response.data.message) {
        setLoginStatus(Response.data.message);
        if(Response.data.message == "admin" || Response.data.message == "user") {
          navigate("/Mainpage");
        }
        
      }
      else {
        setLoginStatus(Response.data[0].username);
      }
    });
  }
  
  useEffect(()=> {
    Axios.get('http://localhost:3001/login').then((Response) => {

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
    <div className=" bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="grid place-items-center h-screen">
        <div className="Login w-80 h-80 shadow rounded bg-white">
          <img className="scale-75 pb-8" src="logotest.png" alt="" />
            <div className="pt-2 flex justify-center">
              <label className="border-b border-black">
                <input
                  className="ttit ppearance-none bg-transparent border-none w-full text-black mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  onChange={(e)=> 
                    {
                      setUsername(e.target.value);
                    }}
            
                  placeholder="Username"
                  required
                />
              </label>
            </div>
            <div className="pt-6 flex justify-center">
              <label className="border-b border-black">
                <input
                  className="ttit ppearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="password"
                  onChange={(e)=> 
                    {
                      setPassword(e.target.value);
                    }}
                 
                  placeholder="Passwort"
                  required
                />
              </label>
            </div>
            <div className=" flex justify-center pt-7">
            {/* dark:bg-gray-900 bei span */}
            <button onClick={PostLogin} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"> 
                Login
              </span>
            </button>
            </div>
            <div className="flex justify-center">
              <h1>{LoginStatus}</h1>
            </div>

            </div>
            
        </div>
      </div>
    
  );
}

export { Login };
