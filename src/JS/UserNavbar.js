import '../CSS/LandingPage.css';
import logo from '../CSS/1.png';

function Navbar() {

  return (
      <div className="NavBar">
        <div className="NavBar-left">
            <img src={logo} className="App-logo" alt="logo" />
            <span className='App-name'>WireFully</span>
        </div>
      </div>
  );
}

export default Navbar;