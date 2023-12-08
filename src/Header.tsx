import './Header.css'
import Headroom from 'react-headroom'

function Header() {

  return (

    <div>
    {/* headroom component makes navbar disappear and reappear on scroll */}
    <div className="part1">
    <Headroom>
    <div className="navbar">
        <h1 className="logo"> The Agency </h1>
        <div className="right-navbar">
        <h3 className="navbar-entry"> About Us </h3>
        <h3 className="navbar-entry"> Learn More </h3>
        </div>
    </div>
    </Headroom>
    </div>
    <div className="part2">
        <h1> Part 2 </h1>
    </div>
    
    </div>

  )
}

export default Header
