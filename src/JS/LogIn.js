import '../CSS/LandingPage.css';
import { useState } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function LogIn({onSignUpClick}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully');
      history.push('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
      <div className='login-contents'>
        <h5>Log in to your account</h5>
        <div className='login-buttons'>
          <button>Continue with Facebook</button>
          <button>Continue with Google</button>
        </div>
        <div className='line-break'>
          <h6>OR</h6>
          </div>
          <div className='login-inputs'>
          <label>Email:</label>
                    <input autoComplete='off' type='text' name="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                    />
                    <label>Password:</label>
                    <input autoComplete='off' type='password' name="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                    />
            <button onClick={handleLogin} disabled={!isFormValid()}>Log In</button>
            <h6 className='back' onClick={onSignUpClick}>Sign up instead</h6>
        </div>
      </div>
  );
}

export default LogIn;