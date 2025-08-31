import React from 'react';
import cn from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ 
  id,
  label, 
  error, 
  icon,
  className,
  ...props 
}) => {
  const baseClass = 
		"block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-transparent transition-all duration-200";
  const focusClass = 
		"focus:outline-none focus:border-white/80 focus:bg-white/10";

  return (
    <div className="">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          id={id}
					placeholder=' '
          className={cn(
							"peer",
              baseClass,
							focusClass,
							{ 'border-red-500/50 focus:ring-red-500': error, 'pl-10': icon },
							className
          )}
					
        />

				<label 
					htmlFor={id}
					className={cn(
            "absolute left-1 text-xs top-2 px-2 -translate-y-7 text-gray-400 dark:text-gray-400 duration-300 transform",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
            "peer-focus:top-2 peer-focus:-translate-y-7  peer-focus:text-xs peer-focus:text-white",
            {
              "left-2 peer-placeholder-shown:left-8 peer-focus:left-2": icon
            }
          )}>
            {label}
				</label>

      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Input;