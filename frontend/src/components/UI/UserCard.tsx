import { motion } from "framer-motion"
import type { MemberPrivateChat } from "shared/types/chat"

interface UserCardProps {
	member: MemberPrivateChat,
	avatar?: string,
	additionalText?: string,
	isOnline?: boolean,
	onClick: (userId: number) => void
}

export const UserCard: React.FC<UserCardProps> = ({
	member,
	avatar,
	additionalText,
	isOnline,
	onClick
}) => {

	const handleClick = () => {
		if (onClick) onClick(member.id)
	}

	return (
		<motion.div 
			className="relative bg-[#1A1A1A] hover:bg-[#2A2A2A] cursor-pointer transition-all duration-300 h-20 pl-4 flex items-center gap-4"
			initial="rest"
			whileHover="hover"
			onClick={handleClick}
		>

			<motion.div 
				className="absolute left-0 top-0 w-0.5 h-full bg-[#4A90E2]"
				variants={{
					rest: { scaleY: 0 },
					hover: { scaleY: 1}
				}}
				style={{ originY: 0.5 }}
				transition={{ type: 'tween', duration: 0.2 }}
			/>

			<div className="w-14 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
				{avatar ? <img /> : 'AB'}
			</div>

			<div className="block flex flex-col text-sm w-full gap-0.5">
				<span className="font-semibold">{member.username}</span>
				<span className="text-gray-500">{additionalText}</span>
			</div>
		</motion.div>
		
	)
}