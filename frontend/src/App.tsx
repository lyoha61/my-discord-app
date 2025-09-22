import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Register';
import AuthChoice from './pages/AuthChoice';
import { LoginPage } from './pages/Login';
import { SocketProvider } from './context/SocketProvider';
import { HomePage } from "src/pages/HomePage.tsx";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthChoice />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={
          <SocketProvider>
            <HomePage />
          </SocketProvider>
        } />
      </Routes>
    </Router>
  )
}

export default App
