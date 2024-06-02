import '../CSS/App.css';
import { BrowserRouter as Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import Display from './Display';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className='MainPage'>
        <Routes>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <ProtectedRoute exact path="/dashboard" component={Dashboard}/>
          <Route exact path="/display">
            <Display />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;