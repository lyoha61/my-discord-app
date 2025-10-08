import { motion } from "framer-motion"
import type { MemberPrivateChat } from "shared/types/chat"
import { useSocketContext } from "src/context/SocketContext";

interface UserCardProps {
	member: MemberPrivateChat;
	variant?: "list" | "header";
	additionalText?: string;
	isSelected?: boolean;
	onClick: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
	member,
	variant,
	additionalText,
	isSelected,
	onClick
}) => {

	const { onlineUsers } = useSocketContext();

	const isHeader = variant === "header";

	const handleClick = () => {
		if (onClick) onClick(member.id)
	}

	return (
		<motion.div 
			className={`relative flex-1 cursor-pointer transition-all duration-300 h-20 pl-4 flex items-center gap-4
				${isHeader ? 'bg-header-color' : isSelected ? "bg-[#2A2A2A]" : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"}	
			`}
			initial="rest"
			animate={isSelected ? "selected" : "rest"}
			whileHover= {isSelected ? "selected" : "hover"}
			onClick={handleClick}
		>
			{!isHeader && 
				<motion.div 
					className={`absolute left-0 top-0 w-0.5 h-full bg-[#4A90E2] 
						${isSelected ? 'bg-[#4A90E2]' : ''}
						
					`}
					variants={{
						rest: { scaleY: 0 },
						hover: { scaleY: 1},
						selected: { scaleY: 1 }
					}}
					style={{ originY: 0.5 }}
					transition={{ type: 'tween', duration: 0.2 }}
				/>
			}
			
			<div className="relative flex items-center justify-center">
				<div className="flex items-center justify-center w-12">
					{
						member.avatar?.url 
							? <img 
									className='w-full aspect-square rounded-full  object-cover'
									src={member.avatar?.url}
								/> 
							: 'AB'
						}
				</div>
				<div className={`absolute border-2 border-[#1A1A1A] right-0 bottom-0 rounded-full w-3.5 h-3.5 ${
					onlineUsers.includes(member.id) ? 'bg-[#5CB85C]' : 'bg-[#6B7280]'
				}`}></div>
			</div>

			<div className="flex flex-col text-sm w-full gap-0.5">
				<span className="font-semibold">{member.username}</span>
				<span className="text-gray-500">{additionalText}</span>
			</div>
		</motion.div>
		
	)
}