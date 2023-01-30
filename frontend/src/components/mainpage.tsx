import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Timer from "./timer";



const Mainpage = () => {

  const [isActive, setActive] = useState<boolean | undefined>(false);
  const [lightstate, lighttoggle] = useState<{ name: string, on: boolean, hours: number, minutes: number, seconds: number }[]>([]);
  const [hours, sethours] = useState(0)
  const [minutes, setminutes] = useState(0)
 
  const navigate = useNavigate();
  const Light = false;

  const ws = () => {
    const socket = io("ws://localhost:3001");

    socket.on("ledstate", (data) => {

      console.log(data);
      let test = data.Message;
      lighttoggle(test);

    });
  }
  
  const mobileMenu = () => {
    setActive(!isActive);
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
    // const timer = setInterval(() => {

    //   setseconds(seconds - 1);
    
    //   if(seconds === 0) {
    //     setseconds(59)
    //     setminutes(minutes-1)
  
    //   }
  
    //   if(minutes === 0 && hours > 0) {
    //     setminutes(59)
    //     sethours(hours - 1);
    //   }
    //   if(hours === 0) {
    //     sethours(0);
    //   }
      
    // }, 1000)

    // return ()=> {clearInterval(timer);}
    
  }, []);

 

  

  function InsertIntoDB(name: string) {
    Axios.post("http://localhost:3001/entries", { ledname: name }).then((Response) => {

      if (Response.data.LoggedIn) {

      }
      else if (!Response.data.LoggedIn) {
        console.log("LOGGED out");
        navigate("/");
      }
    });
  }

  function SetLightStatus(name: string) {
    Axios.post("http://localhost:3001/state", { ledname: name }).then((Response) => {

      if (Response.data.LoggedIn) {

      }

      else if (!Response.data.LoggedIn) {
        console.log("LOGGED out");
        navigate("/");
      }
    });
  }


const allowedNum = ['0','1','2', '3', '4','5','6','7', '8', '9', 'Delete', 'Backspace']


  function Logout() {
    Axios.post("http://localhost:3001/logout").then((Response) => {

      if (Response.data.LoggedOut == true) {

        navigate("/");

      }
    });
  }
 

  function setTime(ESP: string, statusled: boolean) {
    Axios.post("http://localhost:3001/time", {ledhours: hours, ledminutes: minutes, ESPName: ESP, status: statusled}).then((Response) => {

        if(Response.data.test == true) {
          sethours(0)
          setminutes(0)
        }

    });

  }
  return (
    
    <div className=" bg-gradient-to-br from-purple-600 to-blue-500 min-h-screen pb-2 flex flex-col">
      <nav className="bg-white border-gray-200 px-2 sm:pl-5 py-2.5 rounded">
        <div className="flex flex-wrap items-center justify-between ">
          <a href="Mainpage" className="">
            <img
              src="logoIpsum.png"
              className="h-6 sm:h-9"
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
            <ul className="flex flex-col p-4 mt-4  sm:-mb-1.5 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
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
                  href="/About"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
                >
                  About
                </a>
              </li>
             
              <div className="grid">
              <button className="h-34 cursor-pointer justify-self-center p-2 mt-2 sm:-mt-2 sm:w-full w-11/12 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group 
              bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white 
              focus:ring-4 focus:outline-none focus:ring-blue-300 " onClick={()=> {Logout();}}>
               
                Log out
              
              </button>
              </div>
            </ul>

          </div>
        </div>
      </nav>
    <div className="sm:mx-3 mx-2 ">
    <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 sm:gap-x-3 gap-y-3 grid-flow-row-dense">
            {lightstate.map((light)=>
            
        <div className="bg-white rounded-lg shadow-xl min-h-[200px] sm:min-h-[250px]">
            <div className="flex justify-between h-full items-center">
              <div className="-mr-6 -ml-2">
              <button type="button" onClick={()=>{SetLightStatus(light.name); InsertIntoDB(light.name)}}>
              <img
                src={light.on ? "bulb_on.svg" : "bulb_off.svg"}
                id="bulbbnt"
                alt={light.on ? "bulb_on" : "bulb_off"}
                className="sm:h-44"
                />
              </button>
          </div>
          <div className="flex  flex-col">
          <span className="text-xl self-center">{light.name}</span>
          
          <label className="">
            <input type="number" placeholder="00" max="23" min="0" id="num" name="num" 
           onKeyDown={ (evt) => {if(allowedNum.includes(evt.key)){
              
              return  evt.key
           } else {

            evt.preventDefault()
           }
          }}
          onChange={(event: any) => {(event.target.value = event.target.value.slice(0, 2)); sethours(event.target.value)}} 
          className="focus:ring-0 appearance-none  border-none focus:outline-none bg-slate-400" required></input>
            :
            <input type="number" placeholder="00" max="59" min="1"  id="num2" name="num2" 
             onKeyDown={ (evt) => {if(allowedNum.includes(evt.key)){

              return  evt.key
           } else {

            evt.preventDefault()
           }
          }}
              onChange={(event: any) => {(event.target.value = event.target.value.slice(0, 2)); setminutes(event.target.value)}} 
              className="focus:ring-0 appearance-none  border-none focus:outline-none" required></input>
       
          </label>
          <button onClick={()=>{setTime(light.name, light.on)}}>butoon</button>
          
          </div>
          
          <div className="grid col-1 gap-y-3 mr-4">
          <button
            onClick={()=>{SetLightStatus(light.name); InsertIntoDB(light.name)}}
            id="btn1"
            className={light.on? "h-34 py-2 px-3 overflow-hidden text-md font-medium text-gray-900  bg-purple-600  focus:ring-0 focus:outline-none cursor-not-allowed opacity-50 rounded-full"
            : "h-34 py-2 px-3 overflow-hidden text-md font-medium text-gray-900  bg-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full"}
            disabled={light.on ? true : false}>
            Turn On
          </button>

           <button
            onClick={()=>{SetLightStatus(light.name); InsertIntoDB(light.name)}}
            id="btn2"
            className={light.on? "h-34 cursor-pointer py-2 px-3 overflow-hidden text-md font-medium text-gray-900 rounded-full  bg-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
            : "h-34 py-2 px-3 overflow-hidden text-md font-medium text-gray-900 rounded-full  bg-blue-500 focus:outline-none cursor-not-allowed opacity-50"}
            disabled={light.on ? false : true}>
            Turn off
          </button>
          </div>
          <Timer hours={light.hours} minutes={light.minutes} seconds={light.seconds} />
          </div>
        </div>
              
            )}
         
      </div>
      </div>

     
      <div className="flex-grow">
      </div>
      

      
      
      
       
    </div>
    
  );
};

export default Mainpage;
