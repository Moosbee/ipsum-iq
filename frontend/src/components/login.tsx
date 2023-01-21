import React, { useEffect, useState } from "react";
import Axios from 'axios';
import {BrowserRouter as Router, Navigate, Route} from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Login(props: any) {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [LoginStatus, setLoginStatus] = useState("");
  const [isvis, setvis] = useState<boolean | undefined>(false);

  const navigate = useNavigate();
  
  const pasvis = () => { 
    setvis(!isvis);
  };

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
                  className="ttit focus:ring-0 appearance-none bg-transparent border-none w-full text-black mr-3 py-1 px-2 leading-tight focus:outline-none"
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
                  className="ttit focus:ring-0 appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type={isvis? "text" : "password"}
                  onChange={(e)=> 
                    {
                      setPassword(e.target.value);
                    }}
                    onKeyDown={(e)=>{if (e.key === "Enter") {
                        PostLogin();
                    }
                  }
                }
                 
                  placeholder="Passwort"
                  required
                  
                >
                  
                
                  </input>
                  <div className="float-right">
      
                    <button className={isvis ? "hidden absolute -mt-6 ml-1.5": "absolute -mt-6 ml-1.5"} onClick={pasvis}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      </button>
                    
                    <button className={isvis? "absolute -mt-6 ml-1.5": "hidden absolute -mt-6 ml-1.5"}  onClick={pasvis}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </button>
</div>
              </label>


            </div>
            <div className=" flex justify-center pt-7">
            {/* dark:bg-gray-900 bei span */}
            <button onClick={PostLogin} className=" cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
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
