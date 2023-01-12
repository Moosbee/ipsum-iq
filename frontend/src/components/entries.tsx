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

    function printEntries() {
        for (let i = 0; i < querys[0].length; i++) {
            console.log(querys[0][i]);
        }
    }


    return (
        <>
         <Querylist />
            <div>
                <button onClick={() => printEntries()}>ASFASDFASFASF</button>
                <br />

            </div>
        </>
    );
};

export default Entries;
