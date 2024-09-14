import '../CSS/App.css';
import { BrowserRouter as Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

function App() {
  return (
    <BrowserRouter>
      <div className='MainPage'>
        <Routes>
            <Dashboard/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;