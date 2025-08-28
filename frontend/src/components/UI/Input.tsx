import React from 'react';
import cn from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon,
  className,
  ...props 
}) => {
  const baseClass = 
		"w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-transparent transition-all duration-200";
  const focusClass = 
		"focus:outline-none focus:border-white/80 focus:bg-white/10";

  return (
    <div className="">
      <div className="relative space-y-3">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          {...props}
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
					htmlFor="{props.id}"
					className={cn(
						"absolute left-4 top-[-1.4rem] text-gray-400 text-sm transition-all duration-200",
						"peer-placeholder-shown:top-3.5",
						"peer-focus:top-[-1.4rem] peer-focus:left-2"
					)}
				>
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