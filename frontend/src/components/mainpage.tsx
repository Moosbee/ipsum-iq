import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";


const Mainpage = () => {


  const [isActive, setActive] = useState<boolean | undefined>(false);
  const [lightstate, lighttoggle] = useState<{name:string,on:boolean}[]>([]);
  const navigate = useNavigate();
  const Light = false;
 
  const ws = () => {
    const socket = io("ws://localhost:3001");
    
    socket.on("ledstate", (data) => {

      console.log(data);
      let test = data.Message
      lighttoggle(test);

    })
    
  }

  const mobileMenu = () => { 
    setActive(!isActive);
  };

  const testbulb = (name:string) => {
    const newlightstate=lightstate.map((light)=>{
      if(light.name==name){
        light.on=!light.on;
      }
      return light;
    })
    lighttoggle(newlightstate);
  };

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    
    Axios.get("http://localhost:3001/Mainpage").then((Response) => {
      if (Response.data.LoggedIn) {
        console.log("LOGGED IN");
        navigate("/Mainpage");
      } else if (!Response.data.LoggedIn) {
        console.log("LOGGED out");
        navigate("/");
      }
    });

    ws();
    
  }, []);

  function InsertIntoDB(name: string) {
    Axios.post("http://localhost:3001/entries", {ledname: name}).then((Response) => {

      if (Response.data.LoggedIn) {

      } 
      else if (!Response.data.LoggedIn) {
        console.log("LOGGED out");
        navigate("/");
      }
    });
  }

  function SetLightStatus(name: string) {
    Axios.post("http://localhost:3001/state", {ledname: name}).then((Response) => {

      if (Response.data.LoggedIn) {

      } 

      else if (!Response.data.LoggedIn) {
        console.log("LOGGED out");
        navigate("/");
      }
    });
  }


  return (
    <div className=" bg-gradient-to-br from-purple-600 to-blue-500 min-h-screen max-h-full">
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a href="Mainpage" className="flex items-center justify-self-start">
            <img
              src="logotest.png"
              className="h-6 mr-3 sm:h-9"
              alt="Ipsum|IQ Logo"
            />
          </a>
          <button
            onClick={mobileMenu}
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className={
              isActive
                ? "mobile-menu w-full md:block md:w-auto"
                : "hidden mobile-menu w-full md:block md:w-auto"
            }
            id="navbar-default"
          >
            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white ">
              <li>
                <a
                  href="Mainpage"
                  className=" block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 "
                  aria-current="page">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/Entries"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">
                  Log
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
                >
                  Pricing
                </a>
              </li>
              <div className="grid">
              <button className="h-34 cursor-pointer justify-self-center p-2 mt-2 sm:-mt-1.5 sm:w-full w-10/12 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group 
              bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white 
              dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
               
                Log out
              
              </button>
              </div>
            </ul>
            
          </div>
        </div>
      </nav>

      <div className="grid mt-2 grod-cols-1 sm:grid-cols-2 sm:gap-x-2 gap-y-3 grid-flow-row-dense ">
            {lightstate.map((light)=>
        <div className="bg-white rounded-lg shadow-xl min-h-[200px]">
              <div className="grid grid-cols-4">
            <button type="button" onClick={()=>{testbulb(light.name); SetLightStatus(light.name); InsertIntoDB(light.name)}}>
              <img
                src={light.on ? "bulb_on.svg" : "bulb_off.svg"}
                id="bulbbnt"
                alt=""
              />
            </button>
          </div>
          <button
            onClick={()=>{testbulb(light.name); SetLightStatus(light.name); InsertIntoDB(light.name)}}
            id="btn1"
            className={light.on? "p-8 bg-yellow-300 opacity-50 cursor-not-allowed": "p-8 bg-red-600"}
            disabled={light.on ? true : false}>
            Turn On
          </button>

           <button
            onClick={()=>{testbulb(light.name); SetLightStatus(light.name); InsertIntoDB(light.name)}}
            id="btn2"
            className={light.on? "p-8 bg-red-600 ": "p-8 bg-yellow-300 cursor-not-allowed opacity-50"}
            disabled={light.on ? false : true}>
            Turn off
          </button>
        </div>
              
            )}
         
      </div>

      {/* hover und click animation und obstond */}

      <div className="flex justify-center mt-5">
        <button className="cursor-pointer rounded-full bg-gray-400 text-center py-2 px-4 h-14 w-14 inline-flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Mainpage;
