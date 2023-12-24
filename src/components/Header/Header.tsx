import './Header.css'
import Headroom from 'react-headroom'

function Header() {

  return (

    <div>
      {/* headroom component makes navbar disappear and reappear on scroll */}
      <Headroom>
        <div className="navbar">
            <h1 className="logo">The Agency</h1>
            <div className="right-navbar">
              <h3 className="navbar-entry"> About Us </h3>
              <h3 className="navbar-entry"> Learn More </h3>
            </div>
        </div>
      </Headroom>
    </div>


  )
}

export default Header
