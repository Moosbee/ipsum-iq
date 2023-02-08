import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import Timer from "./timer";

interface ESPProps {
    light: {name: string, on: boolean, time: number, futureTime: number }
    
}


const ESP: React.FC<ESPProps> = ({light}) => {

    
    const navigate = useNavigate();
    const [isActive, setActive] = useState<boolean | undefined>(false);
    const [hoursServer, sethoursServer] = useState(0)
    const [minutesServer, setminutesServer] = useState(0)
    const [hours, sethours] = useState(0)
    const [minutes, setminutes] = useState(0)
    const [valreset, setvalreset] = useState(false);
    const [stopped, setstopper] = useState<boolean | undefined>(true);

    const allowedNum = [48,49,50,51,52,53,54,54,56,57,37,39,8,46, 9 ]

        const StopBut = () => {
        setstopper(!stopped);
        
        };

    function TimeSubmittable():boolean{

            if(!light.on){
                return false;
            };
            if(light.futureTime < Date.now()){
            return true
            }
            return false;
        };

        function RunningTime():boolean{

            if(light.futureTime < Date.now()){
                return true
                }
                return false;

        };


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

    function setTime(ESP: string, statusled: boolean) {
        Axios.post("http://localhost:3001/time", { ledhours: hours, ledminutes: minutes, ESPName: ESP, status: statusled }).then((Response) => {
            if(Response.data.futureTime) {
            }
        });
    }

    function ClearTimer(ESP: string) {
        Axios.post("http://localhost:3001/timeclear", {ESPName: ESP}).then((Response) => {

        })
    }
        const names = ["Moruk", "el", "Ehemst"];

        return (
            <div className="bg-white rounded-lg shadow-xl min-h-[200px] sm:min-h-[250px]">
            <div className="flex justify-between h-full items-center">
              <div className="-mr-6 -ml-2">
              <button type="button" onClick={()=>{SetLightStatus(light.name); InsertIntoDB(light.name);
                    if(light.on === true){

                        ClearTimer(light.name)
                    }
                }}>
              <img
                src={light.on ? "bulb_on.svg" : "bulb_off.svg"}
                id="bulbbnt"
                alt={light.on ? "bulb_on" : "bulb_off"}
                className="sm:h-44"
                />
              </button>
          </div>
          <div className="flex  flex-col">
            <span className=" self-center select-none text-white py-1 mt-4" hidden={RunningTime()}>.</span>
            
          <span className="text-xl self-center">{light.name}</span>
          <div className="flex justify-center">
          <label className="EM ">
            <input type="number" placeholder="00" max="23" min="0" id="num" name={light.name} maxLength={2}
           onKeyDown={ (evt) => {if(allowedNum.includes(evt.keyCode)){
              
           } else {

            evt.preventDefault()
           }
          }}
          onChange={(event: any) => {(event.target.value = event.target.value.slice(0, 2));sethours(event.target.value);
          if (event.target.value.length >= 2){
            (event.target.nextElementSibling?.nextElementSibling as HTMLElement)?.focus()
          }}}
          className="focus:ring-0 appearance-none  border-none focus:outline-none p-0 NumericEntry w-5 text-right" required></input>

            <span>:</span>

            <input type="number" placeholder="00" max="59" min="1"  id="num2" name={light.name + '2'} 
             onKeyDown={ (evt) => {if(allowedNum.includes(evt.keyCode)){
              return  evt.key
           } else {

            evt.preventDefault()
           }
         
          }}
              onChange={(event:any) => {(event.target.value = event.target.value.slice(0, 2));setminutes(event.target.value);
                if ((event.target as HTMLInputElement).value.length === 0){
                  (((event.target as HTMLElement).previousElementSibling as HTMLElement).previousElementSibling as HTMLElement)?.focus()
                }}} 
              className="NumericEntry focus:ring-0 appearance-none border-none focus:outline-none w-5 p-0" required></input>
       <button  onClick={() => { setTime(light.name, light.on)}} className={TimeSubmittable()?"" : "cursor-not-allowed opacity-25"} disabled={!TimeSubmittable()}>
       <svg xmlns="http://www.w3.org/200)0/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 -mb-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

       </button>
          </label>
          
          </div>
          
                <div className="self-center mt-4" hidden={RunningTime()}>
                    <div className='rounded-lg bg-gray-50 drop-shadow-lg'>
                        <div className='py-1 pl-3 pr-2'>
                  <span className='mr-3'><Timer futureTime={light.futureTime} /></span>
                    <button onClick={() =>{ClearTimer(light.name)}} className="">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14.5" fill="currentColor" className="w-4 h-4">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                  </button>
                  </div>
                  </div>

                </div>

          </div>
          
          <div className="grid col-1 gap-y-3 mr-4">
          <button
            onClick={()=>{SetLightStatus(light.name); InsertIntoDB(light.name)}}
            id="btn1"
            className={light.on? "h-34 py-2 px-3 overflow-hidden text-md font-medium text-gray-900  bg-purple-600  focus:ring-0 focus:outline-none cursor-not-allowed opacity-50 rounded-full"
            : "h-34 py-2 px-3 overflow-hidden text-md font-medium text-gray-900  bg-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-400 rounded-full"}
            disabled={light.on ? true : false}>
            Turn On
          </button>

           <button
            onClick={()=>{SetLightStatus(light.name); InsertIntoDB(light.name); ClearTimer(light.name)}}
            id="btn2"
            className={light.on? "h-34 cursor-pointer py-2 px-3 overflow-hidden text-md font-medium text-gray-900 rounded-full  bg-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
            : "h-34 py-2 px-3 overflow-hidden text-md font-medium text-gray-900 rounded-full  bg-blue-500 focus:outline-none cursor-not-allowed opacity-50"}
            disabled={light.on ? false : true}>
            Turn off
          </button>
                
          </div>
          
                            
                    
                </div>
            </div>

        );

    }
;


export default ESP;