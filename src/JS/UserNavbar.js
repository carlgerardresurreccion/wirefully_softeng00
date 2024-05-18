import '../CSS/LandingPage.css';
import logo from '../CSS/1.png';

function Navbar() {

  return (
      <div className="NavBar">
        <div className="NavBar-left">
            <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className='NavBar-middle'>
            <span>WireFully</span>
        </div>
        <div className="NavBar-right">
            <button className='username'>Username</button>
        </div>
      </div>
  );
}

export default Navbar;