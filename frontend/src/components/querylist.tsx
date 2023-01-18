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
            <div className='text-center mt-1'>
            
                
            <div className="flex justify-center">
    <table className=" md:w-9/12 w-11/12 text-sm text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="md:px-6 px-2 py-3 text-center border-r-2 border-gray-400 border-b-2">
                Benutzer
                </th>
                <th scope="col" className="md:px-6 px-2 py-3 text-center border-r-2 border-gray-400 border-b-2" >
                Datum
                </th>
                <th scope="col" className="md:px-6 px-2 py-3 text-center border-r-2 border-gray-400 border-b-2">
                Zeitpunkt
                </th>
                <th scope="col" className="md:px-6 px-2 py-3 text-center border-r-2 border-gray-400 border-b-2">
                Licht
                </th>
                <th scope="col" className="md:px-6 px-2 py-3 text-center border-gray-400 border-b-2">
                Status
                </th>
            </tr>
        </thead>
 
           
                        {
                            querys[0]?.map((entry: any, index: any) => 
                               
                                <>
                                <tbody  className="even:bg-gray-300 odd:bg-white">
                                <tr className=''>
                                <td className='text-center border-r-2 border-gray-400'>{entry.user}</td>
                                    <td className='text-center border-r-2 border-gray-400'>{entry.Datum}</td>
                                    <td className='text-center border-r-2 border-gray-400'>{entry.Zeitpunkt}</td>
                                    <td className='text-center border-r-2 border-gray-400'>{entry.Licht}</td>
                                    <td className='text-center'>{entry.Status}</td>
                                    
                                   
                                </tr>
                                </tbody>
                               
                                </>
                                

                        )
                        }
                   
            </table>
        </div>
         
                    
                
                
            </div>
            
            



        </>

    )
}

export default Querylist;