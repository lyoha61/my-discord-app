import React, {type ReactNode, useState} from "react";
import { Input } from "../UI/Input";
import LockIcon from "assets/icons/lock.svg?react";
import EyeSlashIcon from "assets/icons/eye-slash.svg?react";
import EyeIcon from "assets/icons/eye.svg?react";

interface FromProps {
	title: string;
	submitTitle: string;
	inputs: {
    name: string;
    type: string;
    label: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
  }[];
	onSubmit: (data: Record<string, string>) => Promise<void>;
	footerText?: string;
	footerAction: {label: string, onClick:() => void};
}

export const AuthForm: React.FC<FromProps> = ({
	title,
	submitTitle,
	inputs,
	onSubmit,
	footerText,
	footerAction,
}) => {
	const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		try {
			const formData = new FormData(e.currentTarget);
			const data: Record<string, string> = {};
			inputs.forEach(input => {
				data[input.name] = formData.get(input.name) as string;
			})

			await onSubmit(data);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError('Ошибка сервера');
		}
		
	}

	return (
		<div className="min-h-screen flex items-center justify-center">

			<div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md min-h-90 text-[#374151]">
			
				<div className="flex flex-col gap-3 justify-center items-center text-center mb-8">
          <div className='flex justify-center h-[70px] w-[18%] py-4 bg-[#1c2233] rounded-xl'>
            <LockIcon className='h-[90%] w-auto text-[#ffffff] fill-current' />
          </div>
          <div>
					  <h1 className="text-3xl font-bold">{title}</h1>
          </div>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-7">

					{inputs.map(input => {
            const isPassword = input.name === 'password';
            const type = isPassword ? (showPassword ? 'text' : 'password') : input.type;
            const icon = isPassword
              ? showPassword
                ? <EyeIcon className="w-5 cursor-pointer" onClick={() => setShowPassword(false)} />
                : <EyeSlashIcon className="w-5 cursor-pointer" onClick={() => setShowPassword(true)} />
              : input.icon

              return  (
                <Input
                  className="!border-[#D1D5DB] !text-[#374459]"
                  id={input.name}
                  name={input.name}
                  type={type}
                  icon={icon}
                  iconPosition={input.iconPosition}
                  label={input.label}
                  labelClassName="text-[#374459] peer-focus:text-[#374459]"
                  onChange={() => setError('')}
                />
              )
          })}

					<button 
						type ="submit"
						className="w-full bg-[#111827] hover:bg-[#374459] text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 ease-in-out cursor-pointer"
					>
						{submitTitle}
					</button>
				</form>
					
				<div className={`
					text-red-400 text-sm transition-all duration-300 
					overflow-hidden text-center
					${error ? "opacity-100 max-h-10 mt-4" : "opacity-0 max-h-0 mt-0"}
				`}>
					{error}
				</div>


				{footerText && footerAction && (
					<>
					<div className="flex items-center gap-1 mt-6 text-[#4B5563]">
						<hr className="flex-grow border-gray-500 border-t basis-1/4" />
						<span>Или</span>
						<hr className="flex-grow border-gray-500 border-t basis-1/4" />
					</div>
					<div className="flex justify-center gap-1 mt-4">
						<span className="text-sm">{footerText}</span>
						<button
							type="button"
							className="text-sm font-medium transition-colors duration-200 cursor-pointer"
							onClick={footerAction.onClick}
						>
							{footerAction.label}
						</button>
					</div>
					</>
				)}
			</div>
		</div>
	);
}
