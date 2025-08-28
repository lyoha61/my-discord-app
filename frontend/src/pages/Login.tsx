import { useNavigate } from "react-router-dom";
import AuthForm from "../components/Auth/AuthForm";
import { login } from "../services/authService";

function LoginPage() {

	const navigate = useNavigate();

	return (
		<AuthForm
			title ="Вход"
			submitTitle="Войти"
			inputs={[
				{name: 'email', type: 'email', label: 'Почта'},	
				{name: 'password', type: 'password', label: 'Пароль'}

			]}
			onSubmit={async ({ email, password }) => {
				const res = await login(email, password);
				localStorage.setItem('token', res.tokens.access_token);
				localStorage.setItem('refreshToken', res.tokens.refresh_token);
				navigate('/home');
			}}
			footerText="Нет аккаунта?"
			footerAction={ {label: 'Зарегистрироваться', onClick: () => navigate('/register') }}
		/>
	)
}

export default LoginPage;