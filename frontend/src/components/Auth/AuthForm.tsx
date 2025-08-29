import { useState } from "react";
import Input from "../UI/Input";

interface FromProps {
	title: string;
	submitTitle: string;
	inputs: {name: string, type: string, label: string}[];
	onSubmit: (data: Record<string, string>) => Promise<void>
	footerText?: string;
	footerAction: {label: string, onClick:() => void};
}

const AuthForm: React.FC<FromProps> = ({
	title,
	submitTitle,
	inputs,
	onSubmit,
	footerText,
	footerAction
}) => {
	const [error, setError] = useState('');

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

			<div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md min-h-90">
			
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-white">{title}</h1>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">

					{inputs.map(input => (
						<Input
						id={input.name}
						name={input.name}
						type={input.type}
						label={input.label}
						onChange={() => setError('')}
					/>
					))}

					<button 
						type ="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 ease-in-out cursor-pointer"
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
					<div className="flex items-center gap-1 mt-4">
						<hr className="flex-grow border-gray-500 border-t basis-1/4" />
						<span>Или</span>
						<hr className="flex-grow border-gray-500 border-t basis-1/4" />
					</div>
					<div className="flex justify-center gap-1  mt-4">
						<span className="text-sm">{footerText}</span>
						<button
							type="button"
							className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors duration-200 cursor-pointer"
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

export default AuthForm;
