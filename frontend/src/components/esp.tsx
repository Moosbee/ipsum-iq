import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from "react-router-dom";

interface ESPProps {
    light: any
}


const ESP: React.FC<ESPProps> = ({light}) => {

    const allowedNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Delete', 'Backspace']
    const navigate = useNavigate();
    const [isActive, setActive] = useState<boolean | undefined>(false);
    const [hours, sethours] = useState(0)
    const [minutes, setminutes] = useState(0)

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


        });
    }
        const names = ["Moruk", "el", "Ehemst"];

        return (
            <div className="bg-white rounded-lg shadow-xl min-h-[200px] sm:min-h-[250px]">
                <div className="flex justify-between h-full items-center">
                    <div className="-mr-6 -ml-2">
                        <button type="button" onClick={() => { SetLightStatus(light.name); InsertIntoDB(light.name) }}>
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
                                onKeyDown={(evt) => {
                                    if (allowedNum.includes(evt.key)) {

                                        return evt.key
                                    } else {

                                        evt.preventDefault()
                                    }
                                }}
                                onChange={(event: any) => { (event.target.value = event.target.value.slice(0, 2)); sethours(event.target.value) }}
                                className="focus:ring-0 appearance-none  border-none focus:outline-none bg-slate-400" required></input>
                            :
                            <input type="number" placeholder="00" max="59" min="1" id="num2" name="num2"
                                onKeyDown={(evt) => {
                                    if (allowedNum.includes(evt.key)) {

                                        return evt.key
                                    } else {

                                        evt.preventDefault()
                                    }
                                }}
                                onChange={(event: any) => { (event.target.value = event.target.value.slice(0, 2)); setminutes(event.target.value) }}
                                className="focus:ring-0 appearance-none  border-none focus:outline-none" required></input>

                        </label>
                        <button onClick={() => { setTime(light.name, light.on) }}>butoon</button>

                    </div>

                    <div className="grid col-1 gap-y-3 mr-4">
                        <button
                            onClick={() => { SetLightStatus(light.name); InsertIntoDB(light.name) }}
                            id="btn1"
                            className={light.on ? "h-34 py-2 px-3 overflow-hidden text-md font-medium text-gray-900  bg-purple-600  focus:ring-0 focus:outline-none cursor-not-allowed opacity-50 rounded-full"
                                : "h-34 py-2 px-3 overflow-hidden text-md font-medium text-gray-900  bg-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full"}
                            disabled={light.on ? true : false}>
                            Turn On
                        </button>

                        <button
                            onClick={() => { SetLightStatus(light.name); InsertIntoDB(light.name) }}
                            id="btn2"
                            className={light.on ? "h-34 cursor-pointer py-2 px-3 overflow-hidden text-md font-medium text-gray-900 rounded-full  bg-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
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