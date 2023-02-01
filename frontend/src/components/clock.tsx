import React, { Fragment } from "react";


interface Clockprops  {
    
    timerHours: any,
    timerMinutes: any,
    timerSeconds: any,
  };

  
const Clock: React.FC<Clockprops> = ({ timerHours, timerMinutes, timerSeconds }) => {
  return (
    <Fragment>
      <section className="timer-container">
        <section className="timer">
          <div className="clock">
          
            <section>
              <p>{timerHours}</p>
              <small>Hours</small>
            </section>{" "}
            <span>:</span>
            <section>
              <p>{timerMinutes}</p>
              <small>Minutes</small>
            </section>{" "}
            <span>:</span>
            <section>
              <p>{timerSeconds}</p>
              <small>Seconds</small>
            </section>
          </div>
        </section>
      </section>
    </Fragment>
  );
};


export default Clock;