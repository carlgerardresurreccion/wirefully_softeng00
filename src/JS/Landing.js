import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import '../CSS/Landing.css';

const Landing = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className='landing'>
            <div className='rectangle'>
                <div className='left-column'>
                    <h1>
                        <span className='wire'>Wire</span>
                        <span className='fully'>Fully</span>
                    </h1>
                </div>
                <div className='right-column'>
                    <p className='tag' >
                        {isLogin ? 'Log in to your account' : 'Create your account'}
                    </p>
                    {isLogin ? (
                        <Login toggleForm={() => setIsLogin(false)} />
                    ) : (
                        <Signup toggleForm={() => setIsLogin(true)} />
                    )}
                    <p className='tag-bottom' >
                        {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
                        <a href="#" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign up' : 'Log in'}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
