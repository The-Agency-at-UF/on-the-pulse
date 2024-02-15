import './Header.css'
import Headroom from 'react-headroom'
import Hamburger from './Hamburger'
import {Link} from 'react-router-dom';
import {useState} from 'react'

const Header: React.FC = () => {

  const [hamburgerState, setHamburgerState] = useState<boolean>(false);

  const receiveHamburgerState = (data: boolean):void => {
    setHamburgerState(!data);
  };

  
  return (
    <>
    <div>
    {/* headroom component makes navbar disappear and reappear on scroll */}

    <Headroom style={{
      zIndex: '20',

    }} pin={hamburgerState}>

    <div className="navbar">
        <div className="flex items-center justify-center"> 
        <h1 className="logo z-30"> <a className="z-30" href="https://theagency.jou.ufl.edu/"> The Agency </a> </h1>
        </div>
        <div className="right-navbar">
        <div className="standard-right">
        <h3 className="navbar-entry"> <Link to="/"> Home </Link> </h3>
        <h3 className="navbar-entry"> <a href="/#about-us"> About Us </a></h3>
        <h3 className="navbar-entry"> <Link to="/learn-more"> Learn More </Link> </h3>
        </div>
        <div className="hamburger"> 
        <Hamburger sendHamburgerState={receiveHamburgerState}/>
        </div>
        </div>
    </div>
    </Headroom>
    </div>
    </>


  )
}

export default Header