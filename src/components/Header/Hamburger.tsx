import { FC } from 'react';
import './Hamburger.css';
import icon from "../../assets/images/hamburger-menu.svg";
import {useState} from "react";
import {Link} from "react-router-dom";

interface HamburgerProps {
    sendHamburgerState: (data: boolean) => void;
}
const Hamburger: FC<HamburgerProps> = ({sendHamburgerState}) => {
  const [hamburgerOpen, setHamburger] = useState<boolean>(false);

  const toggleHamburger = ():void => {
    setHamburger(!hamburgerOpen);
    sendData();
  }

  const sendData = ():void => {
    const data: boolean = hamburgerOpen;
    sendHamburgerState(data);
  }


  return (
    <>
      <div className="hamburger-menu" onClick={toggleHamburger}>
      <img className="hamburger-icon z-30" src={icon}/> 
      </div>

    <div className={`hamburger-overlay z-20${hamburgerOpen ? ' hamburger-overlay-open' : ''}`}>
      <div className="hamburger-links"> 
        <h3 className={`navbar-entry hamburger-entry${hamburgerOpen ? ' hamburger-entry-open' : ''}`}> <Link to="/" onClick={()=>{setHamburger(false); sendData();}}> On the Pulse </Link> </h3>
        <h3 className={`navbar-entry hamburger-entry${hamburgerOpen ? ' hamburger-entry-open' : ''}`}><Link to="/about-us" onClick={()=>{setHamburger(false); sendData();}}> About </Link> </h3>
        <h3 className={`navbar-entry hamburger-entry${hamburgerOpen ? ' hamburger-entry-open' : ''}`}> <Link to="/library" onClick={()=>{setHamburger(false); sendData();}}> Library </Link> </h3>
        <h3 className={`navbar-entry hamburger-entry${hamburgerOpen ? ' hamburger-entry-open' : ''}`}> <Link to="/learn-more" onClick={()=>{setHamburger(false); sendData();}}> Learn More </Link> </h3>
      </div>
    </div> 

    </>
  );
};

export default Hamburger;