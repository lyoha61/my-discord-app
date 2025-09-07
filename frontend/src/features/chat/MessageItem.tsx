import type { ClientMessage } from "shared/types/message"
import { AnimatePresence, motion} from "framer-motion";
import { useState } from "react";

interface MessageItemProps {
	msg: ClientMessage;
	currentUserId: number;
	onDelete: (chatId: number, messageId: number) => void
}

export const MessageItem: React.FC<MessageItemProps> = ({
	msg, 
	currentUserId, 
	onDelete
}) => {
	const isCurrentUser = msg.author_id === currentUserId;
	const time = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
	const [hovered, setHovered] = useState(false);
	console.log(msg)
	return (
		<div 
			className={`relative flex pt-6  ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Message */}
			<motion.div 
				className={`max-w-[65%] px-4 py-2 rounded-2xl ${
					isCurrentUser ? 'bg-[#4A90E2] text-white' : 'bg-[#2A2A2A] text-white'
				}`}
				whileHover={{ scale: 1.02 }}
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 20, scale: 0.95 }}
				transition={{ duration: 0.25 }}
			>
				<div className={`text-xs font-medium mb-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
					{isCurrentUser ? 'Вы' : `User ${msg.author_id}`}
				</div>
				<div className="text-sm">{msg.text}</div>
				<div className="text-sm mt-1">{time}</div>
			</motion.div>

			{/* Actions */}
			<AnimatePresence>
				{hovered && (
					<motion.div
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						className={`absolute -top-3 flex space-x-2 bg-[#393939] w-[10rem] h-[2rem] rounded-full px-4 items-center text-xs ${
							isCurrentUser ? 'right-0' : 'left-0'
						}`}
					>
						<button className="border-r pr-2 border-[#0B0B0B]">Изменить</button>
						<button 
							className="text-red-500 hover:text-red-400 cursor-pointer"
							onClick={() => onDelete(msg.chat_id, msg.id)}
						>
							Удалить
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
);

}