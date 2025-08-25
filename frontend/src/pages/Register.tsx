import { useState } from "react";
import { register } from "../services/auth";

export const Register: React.FC  = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
		const res = await register(email, password);
		const { refresh_token: refreshToken } = res.tokens;
		localStorage.setItem('token', refreshToken);
		setSuccess(`Пользователь ${res.user.email} зарегистрирован!`);
		setError('');
		} catch (err: unknown) {
		  if (err instanceof Error) {
    		setError(err.message);
			} else {
				setError('Неизвестная ошибка');
			}
			setSuccess('');
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<h1>Register</h1>
			<input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
			<input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
			<button type="submit">Register</button>
			{error && <p style={{color:'red'}}>{error}</p>}
			{success && <p style={{color:'green'}}>{success}</p>}
		</form>
	);
}
