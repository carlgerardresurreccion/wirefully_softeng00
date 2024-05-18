import React, {useState} from 'react';
import '../CSS/LandingPage.css';
import logo from '../CSS/1.png';
import LogIn from './LogIn';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function LandingPage() {
  const [currentView, setCurrentView] = React.useState('LandingPage');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleViewChange = (view) => {
    setCurrentView(view);
  }

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  const register = async() => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch(error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <div className="NavBar">
          <div className="NavBar-left">
              <img src={logo} className="App-logo" alt="logo" onClick={() => handleViewChange('LandingPage')}/>
          </div>
          <div className='NavBar-middle'>
              <span onClick={() => handleViewChange('LandingPage')}>WireFully</span>
          </div>
          <div className="NavBar-right">
              <button className='first' onClick={() => handleViewChange('LogIn')}>Log In</button>
          </div>
      </div>
      <div className="Main-Body">
          <div className='box-container'>
            <div className='left'>
              <div className='contents'>
                <h2>WireFully</h2>
                <h4>
                  Transform your use case diagram<br /> scripts into wireframes
                </h4>
              </div>
            </div>
            <div className='right'>
              {currentView === 'LogIn' ? (
                <LogIn onSignUpClick={() => handleViewChange('SignUp')} />
              ) : (
                <div className='login-contents'>
                  <h5>Create an account</h5>
                  <div className='login-inputs'>
                    <label>Email:</label>
                    <input autoComplete='off' type='text' name="email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                    />
                    <label>Password:</label>
                    <input autoComplete='off' type='password' name="password"
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                    />
                    <button onClick={register} disabled={!isFormValid()}>Create an account</button>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

export default LandingPage;