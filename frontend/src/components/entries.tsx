import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Entries = () => {

    const navigate = useNavigate();
    Axios.defaults.withCredentials = true;
    const [querys, setQuerys] = useState<any[]>([]);
    let test = querys[0];

    useEffect(() => {

        Axios.get('http://10.0.0.5:3001/entries').then((Response) => {

            
            if (Response.data.LoggedIn || Response.status != 200) {
                navigate("/Entries");
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
    }, []);
    
    // if(querys[0].length > 0){
    //     querys[0].map(function(each: any){
            
    //     });
    // } 
    // else {
     
    // }


    return (
        <>  <div>
            <table>
                <tr>
                    <th>Benutzer</th>
                    <th>Datum</th>
                    <th>Uhrzeit</th>
                    <th>Statusänderung</th>
                </tr>
            </table>


        </div>
            <div>
                <button onClick={() => console.log(test)}>ASFASDFASFASF</button>  
            </div>
        </>
    );
};

export default Entries;
