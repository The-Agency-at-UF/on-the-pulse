import React, { FC } from 'react';
import './Hamburger.css'
import icon from "./assets/images/hamburger-menu.svg"
import {useState} from "react"
import {Link} from "react-router-dom"


const Hamburger: FC = () => {
  const [hamburgerOpen, setHamburger] = useState<boolean>(false);

  const toggleHamburger = () => {
    setHamburger(!hamburgerOpen)
  }


  return (
    <>
      <div className="hamburger-menu" onClick={toggleHamburger}>
      <img className="hamburger-icon z-30" src={icon}/> 
      </div>

    <div className="hamburger-overlay z-20">
      <div className="hamburger-links"> 
      <h3 className="navbar-entry hamburger-entry"> <Link to="/" onClick={()=>setHamburger(false)}> Home </Link> </h3>
        <h3 className="navbar-entry hamburger-entry"> About Us </h3>
        <h3 className="navbar-entry hamburger-entry"> <Link to="/learn-more" onClick={()=>setHamburger(false)}> Learn More </Link> </h3>
      </div>
    </div> 

      <style jsx>{`
        .hamburger-entry{
          display: ${hamburgerOpen ? 'inherit' : 'none'};
        }

        .hamburger-overlay{
          background-color: ${hamburgerOpen ? 'rgba(0,0,0,.80)' : 'inherit'};
        }

        html, body {
            overflow-y: ${hamburgerOpen ? 'hidden' : 'inherit'};
        }
        
        
      `}</style>
    </>
  );
};

export default Hamburger;