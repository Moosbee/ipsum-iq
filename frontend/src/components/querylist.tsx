import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";



const Querylist = () => {
    const navigate = useNavigate();
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

    function ClearDB () {
        Axios.post("http://localhost:3001/clear").then((Response) => {
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

        <>
            <div className='mt-1'>
            
                
            <div className="flex justify-center">
    <table className=" md:w-9/12 w-11/12 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 rounded-t-md rounded-b-md">
        <thead className="text-xs sm:text-base">
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
                                <tbody  className="odd:bg-gray-300 ">
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
         
                    {/* ned fertig!!!!! */}
        <div className='mt-4 flex justify-center'>

                <button onClick={ClearDB} className='h-34 cursor-pointer py-2 px-4 overflow-hidden text-md font-medium text-gray-900 
                                rounded-xl focus:ring-4 focus:outline-none bg-white'>
                    <div className='flex'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className='ml-1'>Clear Database</span>
                    </div>
                </button>

        </div> 
                
            
            </div>






        </>

    )
}

export default Querylist;