import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Register } from './pages/Register';
import AuthChoice from './pages/AuthChoice';
import Login from './pages/Login';
import HomePage from './pages/HomePage';


function App() {

  return (
      <Router>
      <Routes>
        <Route path="/" element={<AuthChoice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
