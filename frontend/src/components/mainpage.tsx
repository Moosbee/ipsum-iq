import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Mainpage = () => {
  const [isActive, setActive] = useState<boolean | undefined>(false);
 
  const mobileMenu = () => {
    setActive(!isActive);
  };

  const [bulbon, setbulb] = useState<boolean | undefined>(false);
  const testbulb = () => {
    setbulb(!bulbon);
  };

  const navigate = useNavigate();
  const Light = false;

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
  }, []);

  function GetLightStatus() {
    Axios.post("http://localhost:3001/state").then((Response) => {

      if (Response.data.LoggedIn) {

        if(Response.data.ledState) {
          console.log("LED STATE TRUE: " + Response.data.ledState);
        }
        else if (Response.data.ledState == false) {
          console.log("LED STATE false: " + Response.data.ledState);
        }
        else {
          console.log("Error :((((");
        }
      } 

      else if (!Response.data.LoggedIn) {
        console.log("LOGGED out");
        navigate("/");
      }
    });
  }
  function InsertIntoDB() {
    Axios.post("http://localhost:3001/entries").then((Response) => {

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
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="Mainpage"
                  className=" block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="grid mt-2 grod-cols-1 sm:grid-cols-2 sm:gap-x-2 gap-y-3 grid-flow-row-dense ">
        <div className="bg-white rounded-lg shadow-xl min-h-[200px]">
          <div className="grid grid-cols-4">
            <button type="button" onClick={testbulb}>
              <img
                src={bulbon ? "bulb_on.svg" : "bulb_off.svg"}
                id="bulbbnt"
                alt=""
              />
            </button>
          </div>
          <button
            onClick={() => {testbulb(); GetLightStatus()}}
            id="btn1"
            className={
              bulbon
                ? "p-8 bg-yellow-300 opacity-50 cursor-not-allowed"
                : "p-8 bg-red-600"
            }
            disabled={bulbon ? true : false}
          >
            Turn On
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-xl min-h-[200px]"></div>
        <div className="bg-white rounded-lg shadow-xl min-h-[200px]"></div>
        <div className="bg-white rounded-lg shadow-xl min-h-[200px]"></div>
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
