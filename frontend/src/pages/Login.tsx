import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		try {
			const formData = new FormData(e.currentTarget);
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;
			const res = await login(email, password);

			localStorage.setItem('token', res.tokens.access_token);
			localStorage.setItem('refreshToken', res.tokens.refresh_token);

			navigate('/profile');
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError('Ошибка сервера');
		}
		
	}

	return (
		<div>
			<h1>Вход</h1>
			<form onSubmit={handleSubmit}>
				<input 
					placeholder="Email" 
					type="email"
					name="email"
				/>
				<input 
					placeholder="Пароль" 
					type="password"
					name="password"
				/>
				<button type ="submit">Войти</button>

				{error && (
					<div style={{ color: 'red', marginTop: '10px' }}>
            Ошибка: {error}
          </div>
				)}
			</form>
		</div>
	);
}

export default Login;
