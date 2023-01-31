import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import moment, { min } from 'moment';
import { AnyMxRecord } from 'dns';
import { count } from 'console';

interface TimerProps {
    hours: any;
    minutes: any;
    // end: any;
  
}


const startDate = new Date();

const Timer: React.FC<TimerProps> = ({hours, minutes}) => {

  const names = ["Moruk", "el", "Ehemst"];



    const[rHour, setRHour] = useState(hours);
    const[rMin, setRMin] = useState(minutes);
    const[rSec, setRSec] = useState(0);

    

  
    function getTime(){

      const finishHours = startDate.getHours() + hours + startDate.getMinutes() / 60 + minutes + startDate.getSeconds() / 3600;
      const currentHours =  new Date().getHours() + new Date().getMinutes() / 60 + new Date().getSeconds() / 3600;
      const remainingHours = finishHours - currentHours;
  
      const remainingHour = Math.floor(remainingHours);
      const remainingMinute = Math.floor((remainingHours - remainingHour) * 60);
      const remainingSecond = Math.floor(((remainingHours - remainingHour) * 60 - remainingMinute)*60)
  
      setRHour(remainingHour);
      setRMin(remainingMinute);
      setRSec(remainingSecond);
      console.log("count")
    }
  
    useEffect(() => {
      const i = setInterval(getTime, 1000);
      return () => clearInterval(i);
    }, []);  //dependency, if end changes remount


  return (


    <div className="timer-container">
      <div className="numbers">
        <span className = "num-span">{("0" + rHour).slice(-2)}</span>
        <span className = "segment">:</span>
        <span className = "num-span">{("0" + rMin).slice(-2)}</span>
        <span className = "segment">:</span>
        <span className = "num-span">{("0" + rSec).slice(-2)}</span>
      </div>
    </div>

  )
    
      
  
  




};

export default Timer;