import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";


const Querylist = () => {

    const names = ["Moruk", "el", "Ehemst"];
    Axios.defaults.withCredentials = true;
    const [querys, setQuerys] = useState<any[]>([]);

    useEffect(() => {

        Axios.get('http://localhost:3001/entries').then((Response) => {

            if (Response.data.result) {
                setQuerys(Response.data.result);
            }

            else {
                console.log("error");
            }

        });
    }, [querys]);




    return (

        <>

            <div className='flex justify-center'>

                <table className='rounded-lg bg-white'>
                    <thead>
                    <tr>
                        <th>Benutzer</th>
                        <th>Datum</th>
                        <th>Zeitpunkt</th>
                        <th>Licht</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    
                        {
                            querys[0]?.map((entry: any, index: any) => 
                               
                                <>
                                <tbody  className="odd:bg-gray-300 even:bg-white">
                                <tr>
                                    <td>{entry.user}</td>
                                    <td>{entry.Datum}</td>
                                    <td>{entry.Zeitpunkt}</td>
                                    <td>{entry.Licht}</td>
                                    <td>{entry.Status}</td>
                                   
                                </tr>
                                </tbody>
                                </>
                                

                        )
                        }
                        
                    
                </table>
            </div>


        </>

    )
}

export default Querylist;