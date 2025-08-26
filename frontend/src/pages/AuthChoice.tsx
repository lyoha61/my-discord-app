import { useNavigate } from "react-router-dom"

const AuthChoice: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div>
      <h1>Добро пожаловать!</h1>
      <button onClick={() => navigate("/login")}>Войти</button>
      <button onClick={() => navigate("/register")}>Регистрация</button>
    </div>
  );
}

export default AuthChoice;