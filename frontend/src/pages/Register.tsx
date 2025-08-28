import { useNavigate } from "react-router-dom";
import AuthForm from "../components/Auth/AuthForm";
import { register } from "../services/authService";

const RegisterPage: React.FC  = () => {
	const navigate = useNavigate();

	return (
		<AuthForm
			title ="Регистрация"
			submitTitle="Зарегистрироваться"
			inputs={[
				{name: 'email', type: 'email', label: 'Почта'},	
				{name: 'password', type: 'password', label: 'Пароль'}

			]}
			onSubmit={async ({ email, password }) => {
				const res = await register(email, password);
				localStorage.setItem('token', res.tokens.access_token);
				localStorage.setItem('refreshToken', res.tokens.refresh_token);
				navigate('/home');
			}}
			footerText="Есть аккаунт?"
			footerAction={ {label: 'Войти', onClick: () => navigate('/login') }}
		/>
	)
}

export default RegisterPage;