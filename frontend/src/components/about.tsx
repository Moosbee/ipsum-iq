import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { SHARE_ENV } from "worker_threads";
import ShowUser from './usershow';

const About =() =>  {
    const [isActive, setActive] = useState<boolean | undefined>(false);
    const navigate = useNavigate();

    const mobileMenu = () => { 
        setActive(!isActive);
      };
      Axios.defaults.withCredentials = true;

      useEffect(() => {
        Axios.get('http://localhost:3001/About').then((Response) => {

        if(Response.data.LoggedIn) {
          
          navigate("/About");
    
        }
        else {
          
          navigate("/");
        }
            
        });
   
        
      }, []);


      function Logout() {
        Axios.post("http://localhost:3001/logout").then((Response) => {
    
          if(Response.data.LoggedOut == true) {
    
            navigate("/");
          
          }
        });
      }

    return(
        <div className=" bg-gradient-to-br from-purple-600 to-blue-500 min-h-screen pb-2 flex flex-col">
      <nav className="bg-white border-gray-200 px-2 sm:pl-5 py-2.5 rounded">
        <div className="flex flex-wrap items-center justify-between ">
          <a href="Mainpage" className="">
            <img
              src="LogoIpsum.png"
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
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
                 >
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
                  className=" block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
                  aria-current="page">
                  About
                </a>
              </li>
             
              <div className="grid">
              <button className="h-34 cursor-pointer justify-self-center p-2 mt-2 sm:-mt-2 sm:w-full w-11/12 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group 
              bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white 
              focus-visible:ring-4 focus:outline-none focus:ring-blue-300 " onClick={()=> {Logout();}}>
               
                Log out
              
              </button>
              </div>
            </ul>
            
          </div>
        </div>
      </nav>
      <div className=""></div>
      <div className=" mt-3 flex justify-center w-max-11/12 ">
   <div className="resize border-2 overflow-auto sm:w-6/12 w-11/12 bigH">
    
<iframe title="Pflichtenheft" src="dokumentation_IpsumIq.pdf" className="w-full h-full"></iframe> 
</div>
</div>
      <div className="flex-grow">
      </div>
            <ShowUser />
      
      
       
    </div>
    




































    );
}

export default About;