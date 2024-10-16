import '../CSS/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import Landing from './Landing';
import { AuthProvider } from './AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="MainPage">
          <Routes>
            <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path='/' element={<Landing />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;