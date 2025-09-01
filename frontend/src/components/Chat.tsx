import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket"
import type { Message } from "shared/types/message";
import { getMessages } from "../services/messageService";
import { getCurrentUserId } from "src/services/authService";
import { motion, AnimatePresence } from "framer-motion";
import PaperIcon from "../assets/icons/paper-plane.png";

const Chat: React.FC<{ chatId: number | null }> = ({ chatId }) => {
	const currentUserId = getCurrentUserId();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const socket = useSocket();

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				if(!chatId) return;

				const data = await getMessages(chatId);
				setMessages(data.messages);        
			} catch (err) {
				console.error(err);
			}
		};

		fetchMessages();
		
		if(!socket) return;
		
		socket.on('message', (message: Message) => {
			setMessages(prev => [...prev, message])
		});

		return () => {
			socket.off('message');
		}
	}, [socket, chatId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
	}, [messages]);

	if (!currentUserId) {
		return <div>Пожалуйста, войдите, чтобы открыть чат</div>
	}

	const sendMessage = () => {
		if(!inputMessage.trim() || !socket) return;

		socket.emit('message', { text: inputMessage, chatId });
		setInputMessage('')
	}

	
	return (
		<div className="flex flex-col h-full w-full max-w-2xl bg-[#0B0B0B] text-white  shadow-lg">
			{/* Messages */}
			<div className="flex-1 flex flex-col  p-4 space-y-3 overflow-auto scrollbar-hidden">
				<div className="mt-auto"></div>
				<AnimatePresence initial={false}>
					{messages.map((msg) => (
						<motion.div 
							key={msg.id} 
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale:1 }}
							exit={{ opacity: 0, y: 20, scale: 0.95 }}
							transition={{ duration: 0.25 }}
							className={`flex ${
								msg.author_id === currentUserId
								? 'justify-end'
								: 'justify-start'
							}`}
						>
							
							<div className={`max-w-[65%] px-4 py-2 rounded-2xl ${
								msg.author_id === currentUserId
									? 'bg-[#4A90E2] text-white'
									: 'bg-[#2A2A2A] text-white'
								}`}>
								<div className={`text-xs font-medium mb-1 ${
									msg.author_id === currentUserId ? 'text-blue-100' : 'text-gray-400'
									}`}>
									{msg.author_id === currentUserId ? 'Вы' : `User ${msg.author_id}`}
								</div>
								<div className="text-sm">{msg.text}</div>
								<div className="text-sm mt-1">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
							</div>

						</motion.div>
					))}
				</AnimatePresence>
				<div ref={messagesEndRef}></div>
			</div>

			{/* Input with button */}
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
		</div>
	)

}

export default Chat;