import React, { Fragment } from "react";


interface Clockprops  {
    
    timerHours: any,
    timerMinutes: any,
    timerSeconds: any,
  };

  
const Clock: React.FC<Clockprops> = ({ timerHours, timerMinutes, timerSeconds }) => {
  return (
    <Fragment>
      
          
            <span>{timerHours}:{timerMinutes}:{timerSeconds}</span>
           
       
    </Fragment>
  );
};


export default Clock;