import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Querylist from './querylist';

const Entries = () => {

    const navigate = useNavigate();
    Axios.defaults.withCredentials = true;
    const [querys, setQuerys] = useState<any[]>([]);

    const [isActive, setActive] = useState<boolean | undefined>(false);
    const mobileMenu = () => {
      setActive(!isActive);
    };
    
    useEffect(() => {

        Axios.get('http://localhost:3001/entries').then((Response) => {


            if (Response.data.isAdmin || Response.status != 200) {
                navigate("/Entries");
            }
            else if (Response.data.LoggedIn && Response.data.isAdmin == false){
                navigate("/Mainpage");
            }
            else {
                navigate("/");
            }

            if (Response.data.result) {
                setQuerys(Response.data.result);
            }

            else {
                console.log("error");
            }

        });
    }, [querys]);

    function ClearDB () {
      Axios.post("http://localhost:3001/clear").then((Response) => {
        if(Response.data.LoggedIn) {
          navigate("/entries");
        }
        else {
          navigate("/");
        }
      })
    }

    return (
        <><div className=" bg-gradient-to-br from-purple-600 to-blue-500 min-h-screen max-h-full">
        <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
          <div className="container flex flex-wrap items-center justify-between mx-auto">
            <a href="Mainpage" className="flex items-center justify-self-start">
              <img
                src="logotest.png"
                className="h-6 mr-3 sm:h-9"
                alt="Ipsum|IQ Logo" />
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
              className={isActive
                ? "mobile-menu w-full md:block md:w-auto"
                : "hidden mobile-menu w-full md:block md:w-auto"}
              id="navbar-default"
            >
              <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white ">
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
                    className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 "
                    aria-current="page">
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
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>


        <Querylist />

      </div><button onClick={() => { ClearDB()} }>buttonw</button></>
        
    );
};

export default Entries;
