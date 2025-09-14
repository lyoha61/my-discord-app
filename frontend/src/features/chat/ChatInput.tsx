import { useState } from "react";
import PaperIcon from "../../assets/icons/paper-plane.png";
import type { ClientMessagePayload } from "shared/types/message";
import { useSocketContext } from "src/context/SocketContext";

interface ChatInputProps {
	chatId: number | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({chatId}) => {
	const { chatSocket, sendMessage } = useSocketContext();
	const [inputMessage, setInputMessage] = useState('');

	const handleSend = () => {
		if(!inputMessage.trim() || !chatSocket || !chatId) return;

		const payload: ClientMessagePayload = {
			text: inputMessage,
			chat_id: chatId
		}
		sendMessage(payload);
		setInputMessage('');
	}

	return (
		<div className="flex p-3 bg-[#1A1A1A]">
			<input
				className="flex-1 px-4 py-2 rounded-lg bg-[#2A2A2A] focus:outline-none" 
				type="text"
				value={inputMessage}
				placeholder="Введите сообщение..." 
				onChange={(e) => setInputMessage(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleSend()}
			/>
			<button 
				onClick={handleSend}
				className="ml-3 px-2 transition font-medium cursor-pointer"
			>
				<img className="h-6" src={PaperIcon} alt="" />
			</button>
		</div>
	)
}