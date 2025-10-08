import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Register';
import AuthChoice from './pages/AuthChoice';
import { LoginPage } from './pages/Login';
import { SocketProvider } from './context/SocketProvider';
import { HomePage } from "src/pages/HomePage.tsx";
import { ProfileSettings } from './pages/ProfileSettings';


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
        <Route path='/profile/settings' element={<ProfileSettings />} />
      </Routes>
    </Router>
  )
}

export default App
