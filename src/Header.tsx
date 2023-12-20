import './Header.css'
import Headroom from 'react-headroom'
import Hamburger from './Hamburger'
import {Link} from 'react-router-dom';


const Header: React.FC = () => {

  
  return (
    <>
    <div>
    {/* headroom component makes navbar disappear and reappear on scroll */}

    <Headroom>

    <div className="navbar">
        <div className="flex items-center justify-center"> 
        <h1 className="logo"> <a href="https://theagency.jou.ufl.edu/"> The Agency </a> </h1>
        </div>
        <div className="right-navbar">
        <div className="standard-right">
        <h3 className="navbar-entry"> About Us </h3>
        <h3 className="navbar-entry"> <Link to="/learn-more"> Learn More </Link> </h3>
        </div>
        <div className="hamburger"> 
        <Hamburger/>
        </div>
        </div>
    </div>
    </Headroom>
    </div>
    </>


  )
}

export default Header