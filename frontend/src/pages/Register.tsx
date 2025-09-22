import { useNavigate } from "react-router-dom";
import { AuthForm } from '../components/Auth/AuthForm';
import { register } from "../services/authService";
import EnvelopeIcon from "assets/icons/envelope.svg?react";
import React from "react";

const RegisterPage: React.FC  = () => {
	const navigate = useNavigate();

	return (
		<AuthForm
			title ="Регистрация"
			submitTitle="Зарегистрироваться"
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
				await register(email, password);
				navigate('/home');
			}}
			footerText="Есть аккаунт?"
			footerAction={ {label: 'Войти', onClick: () => navigate('/login') }}
		/>
	)
}

export default RegisterPage;