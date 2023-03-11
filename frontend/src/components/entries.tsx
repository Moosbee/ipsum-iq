import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Querylist from './querylist';
import ShowUser from './usershow';

const Entries = () => {

    const navigate = useNavigate();
    Axios.defaults.withCredentials = true;
    

    const [isActive, setActive] = useState<boolean | undefined>(false);
    const mobileMenu = () => {
      setActive(!isActive);
    };
    
    useEffect(() => {

        Axios.get('http://localhost:80/entries').then((Response) => {


            if (Response.data.isAdmin || Response.status != 200) {
                navigate("/Entries");
            }
            else if (Response.data.LoggedIn && Response.data.isAdmin == false){
                navigate("/Mainpage");
            }
            else {
                navigate("/");
            }


        });
    }, []);

    
    function Logout() {
      Axios.post("http://localhost:80/logout").then((Response) => {
  
        if(Response.data.LoggedOut == true) {
  
          navigate("/");
        
        }
      });
    }
    function ClearDB () {
      Axios.post("http://localhost:80/clear").then((Response) => {
        if(Response.data.LoggedIn) {

          navigate("/mainpage");
          navigate("/entries");
        }
        else {
          navigate("/");
        }
      })
    }

    return (
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
            ></svg>
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
              className={isActive
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
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
                  aria-current="page">
                  Log
                </a>
              </li>
              <li>
                <a
                  href="/About"
                  className= "block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">
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
   
   
        
         <Querylist />

         <div className='mt-4 flex justify-center'>

                <button onClick={ClearDB} className='transition ease-in-out h-34 cursor-pointer py-2 px-4 overflow-hidden text-md font-medium text-gray-900 
                                rounded-xl focus:ring-0 focus:outline-none bg-white hover:scale-110 hover:-translate-y-1'>
                    <div className='flex'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className='ml-1'>Clear Database</span>
                    </div>
                </button>

        </div> 
         <div className="flex-grow">
      </div>
      
                
       <ShowUser />
            </div>
        
        


        
    );
};

export default Entries;
