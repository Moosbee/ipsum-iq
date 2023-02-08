import { Outlet } from 'react-router-dom';
import Axios from 'axios';
import { BrowserRouter as Router, Navigate, Route } from "react-router-dom";
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { AnyMxRecord } from 'dns';
import { count } from 'console';
import Clock from './clock';

interface TimerProps {

  futureTime: any;
  // end: any;

}




const Timer: React.FC<TimerProps> = ({ futureTime }) => {

  const names = ["Moruk", "el", "Ehemst"];

  let timerDays;
  let timerHours;
  let timerMinutes;
  let timerSeconds;
  const [time, setTime] = useState(Date.now());



  const now = new Date().getTime();

  const distance = futureTime - now;

  console.log("DISTANCE " + distance);

  const days = Math.floor(distance / (24 * 60 * 60 * 1000));
   
  const hours = Math.floor(
    (distance % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
  ) +days * 24;
 
  const minutes = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60));
  const seconds = Math.floor((distance % (60 * 1000)) / 1000);

  console.log("MORUK " + distance % (24 * 60 * 60 * 1000) / (1000 * 60 * 60) + " eeeee  " +  hours + "  hours  " + minutes + "  minutes  " + seconds + "  seconds");
 
    // Update Timer
  
    
    timerHours = hours;
    timerMinutes= minutes;
    timerSeconds= seconds;

    if(timerHours < 0) {
      timerHours = 0
    }
    if(timerMinutes < 0) {
      timerMinutes = 0
    }
    if(timerSeconds < 0) {
      timerSeconds = 0
    }

    useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);
 
  return (

    
      <Clock
        timerHours={timerHours}
        timerMinutes={timerMinutes}
        timerSeconds={timerSeconds}
      />
    


  )




};

export default Timer;