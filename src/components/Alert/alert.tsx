import React, { useState, useEffect } from 'react';
import './alert.css'
import icon from "../../assets/images/check.svg";


// Alert takes in title and wehther to display or not, length of time to display in ms
export const Alert = ({ alert, title, hold }) => {
  const [present, setPresent] = useState(alert);
  useEffect(() => {
    if (alert) {
    setPresent(true);
      setTimeout(() => {
        setPresent(false);
      }, hold-600);
    }
  }, [alert]);

  if(alert){
    return (
        <div className={present ? "present":"un-present"}>
        <div className="bg-white p-2 rounded-md w-fit m-5 inline-flex gap-2">
          <h5 className="text-black self-center">{title}</h5>
          <img src={icon} alt="" style={{backgroundColor:'transparent'}} width={28}/>
        </div>
      </div>
      );
  }else{
    return null;
  }
};
