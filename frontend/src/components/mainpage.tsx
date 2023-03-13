import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ESP from "./esp";
import ShowUser from './usershow';



const Mainpage = () => {

  const [isActive, setActive] = useState<boolean | undefined>(false);
  const [lightstate, lighttoggle] = useState<{ name: string, on: boolean, time: number, futureTime: number }[]>([]);

  

  const navigate = useNavigate();
 

  const ws = () => {
    const socket = io("ws://localhost:80");

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

    Axios.get("http://localhost:80/Mainpage").then((Response) => {
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





 


  function Logout() {
    Axios.post("http://localhost:80/logout").then((Response) => {

      if (Response.data.LoggedOut == true) {

        navigate("/");

      }
    });
  }
 
  return (

    <div className=" bg-gradient-to-br from-purple-600 to-blue-500 min-h-screen pb-2 flex flex-col">
      <nav className="bg-white border-gray-200 px-2 sm:pl-5 py-2.5 rounded">
        <div className="flex flex-wrap items-center justify-between ">
          <a href="Mainpage" className="">
            <img
              src="LogoIpsum.png"
              className="h-6 sm:h-9"
              alt="Ipsum|IQ -Logo"
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
              focus-visible:ring-4 focus:outline-none focus:ring-blue-300 " onClick={() => { Logout(); }}>

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
            <ESP light={light} />
          )}

        </div>
      </div>
      <div className="flex-grow">
      </div>
      <ShowUser />
      
      
       
    </div>

  );
};

export default Mainpage;
