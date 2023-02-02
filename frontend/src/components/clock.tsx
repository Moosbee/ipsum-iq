import React, { Fragment } from "react";


interface Clockprops  {
    
    timerHours: number,
    timerMinutes: number,
    timerSeconds: number,
  };

  
const Clock: React.FC<Clockprops> = ({ timerHours, timerMinutes, timerSeconds }) => {
  let HourString:string ="" + timerHours;
  let MinString:string ="" + timerMinutes;
  let SecString:string ="" + timerSeconds;
  if(timerHours < 10){

      HourString = "0" + HourString

  }
  if(timerMinutes < 10){

    MinString = "0" + MinString

  }
  if(timerSeconds < 10){

    SecString = "0" + SecString

  	}
  return (
    <Fragment>
      
              
            <span>{HourString}:{MinString}:{SecString}</span>
           
       
    </Fragment>
  );
};


export default Clock;