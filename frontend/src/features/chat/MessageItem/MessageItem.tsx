import type { ClientMessage } from "shared/types/message"
import { AnimatePresence, motion} from "framer-motion";
import React, { useRef, useState } from "react";
import { useSocketContext } from "src/context/SocketContext";
import { MessageContent } from "./MessageContent";

interface MessageItemProps {
	msg: ClientMessage;
	currentUserId: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
	msg, 
	currentUserId, 
}) => {
	const isCurrentUser = msg.author_id === currentUserId;
	
	const { updateMessage, deleteMessage } = useSocketContext();
	const [hovered, setHovered] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(msg.text);

	const containerRef = useRef<HTMLDivElement>(null);


	const handleEditSubmit = () => {
		if (editText.trim() && editText !== msg.text) {
			updateMessage({
				text: editText.trim(),
				id: msg.id,
			});
			msg.text = editText.trim();
		}
		setIsEditing(false);
	}

	const handleDelete = () => {
		try {
			deleteMessage({id: msg.id})
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error(`Error delete message ${msg.id} error: ${err.message}`)
			} else {
				console.error(`Error delete message ${msg.id}`)
			}
		}
	};

	return (
		<div 
			className={`relative flex pt-6 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Message */}
			<motion.div 
				className='inline-flex w-fit flex-col max-w-[55%]'
				ref={containerRef}
				whileHover={{ scale: 1.02 }}
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 20, scale: 0.95 }}
				transition={{ duration: 0.25 }}
			>
				{/* Nickname */}
				<div className={`inline-flex w-fit text-xs font-medium mb-1 ${isCurrentUser ? '' : 'text-gray-400'}`}>
					{isCurrentUser ? '' : `${msg.author_name}`}
				</div>

				<MessageContent 
					msg={msg} 
					isCurrentUser={isCurrentUser}
					isEditing={isEditing}
					editText={editText}
					setEditText={setEditText}
					onEditSubmit={handleEditSubmit}
				/>
				
			</motion.div>

			{/* Actions */}
			<AnimatePresence>
				{hovered && !isEditing && isCurrentUser && (
					<motion.div
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						className={`absolute -top-3 flex space-x-2 bg-[#393939] w-[10rem] h-[2rem] rounded-full px-4 items-center text-xs ${
							isCurrentUser ? 'right-0' : 'left-0'
						}`}
					>
						<button 
							className="border-r pr-2 border-[#0B0B0B] cursor-pointer text-[#D1D5DB]"
							onClick={() => setIsEditing(true)}
						>
							Изменить
						</button>
						<button 
							className="text-red-500 hover:text-red-400 cursor-pointer"
							onClick={() => handleDelete()}
						>
							Удалить
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}