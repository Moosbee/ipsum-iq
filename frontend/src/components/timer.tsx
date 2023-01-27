import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { useEffect, useState, Fragment } from 'react';

interface TimerProps {
    hours: any;
    minutes: any;
    seconds: any;
  }


  const Timer: React.FC<TimerProps> = ({hours, minutes, seconds}) => {

    const names = ["Moruk", "el", "Ehemst"];
    

    let timer: any;
    useEffect(() => {

        
       
    }, []);


    return <Fragment>
        <section>
                <p>{hours < 10? "0" +hours: hours}:{minutes < 10? "0" +minutes: minutes}:{seconds < 10? "0" +seconds: seconds}</p>

        </section>

    </Fragment>

      

    
};

export default Timer;