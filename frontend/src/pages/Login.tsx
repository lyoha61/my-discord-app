import { useNavigate } from "react-router-dom";
import { AuthForm } from '../components/Auth/AuthForm';
import { login } from "../services/authService";
import EnvelopeIcon from "assets/icons/envelope.svg?react";
import React from 'react';

export const LoginPage: React.FC =  () => {

	const navigate = useNavigate();

	return (
		<AuthForm
			title ="Вход"
			submitTitle="Войти"
			inputs={[
				{
          name: 'email',
          type: 'email',
          label: 'Почта',
          icon:<EnvelopeIcon className="w-5 text-[#ffffff]" />,
          iconPosition: 'right',
        },
				{
          name: 'password',
          type: 'password',
          label: 'Пароль',
          iconPosition: 'right',
        }

			]}
			onSubmit={async ({ email, password }) => {
				await login(email, password);
				navigate('/home');
			}}
			footerText="Нет аккаунта?"
			footerAction={ {label: 'Зарегистрироваться', onClick: () => navigate('/register') }}
		/>
	)
}
