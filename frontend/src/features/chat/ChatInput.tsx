import { useState } from "react";
import PaperIcon from "../../assets/icons/paper-plane.png";
import type { Socket } from "socket.io-client";
import type { ClientMessagePayload } from "shared/types/message";

interface ChatInputProps {
	socket: Socket | null;
	chatId: number | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({socket, chatId}) => {

	const [inputMessage, setInputMessage] = useState('');

	if (!socket || !chatId) return null;

	const sendMessage = () => {
		if(!inputMessage.trim() || !socket || !chatId) return;

		const payload: ClientMessagePayload = {
			text: inputMessage,
			chat_id: chatId
		}

		socket.emit('message', payload);
		setInputMessage('')
	}

	return (
		<div className="flex p-3 bg-[#1A1A1A]">
			<input
				className="flex-1 px-4 py-2 rounded-lg bg-[#2A2A2A] focus:outline-none" 
				type="text"
				value={inputMessage}
				placeholder="Введите сообщение..." 
				onChange={(e) => setInputMessage(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
			/>
			<button 
				onClick={sendMessage}
				className="ml-3 px-2 transition font-medium cursor-pointer"
			>
				<img className="h-6" src={PaperIcon} alt="" />
			</button>
		</div>
	)
}