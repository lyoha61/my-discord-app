import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket"
import type { ClientMessage, MessageEvent } from "shared/types/message";
import { deleteMessage, getMessages } from "../../services/messageService";
import { getCurrentUserId } from "src/services/authService";
import { AnimatePresence } from "framer-motion";
import { formatDate } from "src/utils/formatDate";
import { MessageItem } from "./MessageItem";
import { ChatInput } from "./ChatInput";

const Chat: React.FC<{ chatId: number | null }> = ({ chatId }) => {
	const currentUserId = getCurrentUserId();
	const [messages, setMessages] = useState<ClientMessage[]>([]);
	
	const socket = useSocket();

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	let lastDate = '';

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
		
		socket.on('message', (message: MessageEvent) => {
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

	const handleDelete = async (chatId: number, messageId: number) => {
		await deleteMessage(chatId, messageId);
		setMessages(prev => prev.filter(m => m.id !== messageId));
	}
	
	return (
		<div className="flex flex-col h-full w-full max-w-2xl bg-[#0B0B0B] text-white  shadow-lg">
			{/* Messages */}
			<div className="flex-1 flex flex-col p-4 overflow-auto scrollbar-hidden">
				<div className="mt-auto"></div>
				<AnimatePresence initial={false}>
					{messages.map((msg) => {
						const currentDate = formatDate(msg.created_at);
						const showDate = currentDate !== lastDate;
						lastDate = currentDate;
						return (
							<div key={msg.id}>
								{showDate && (
									<div className="flex justify-center">
										<div className="bg-[#393939] rounded-full py-2 px-4 text-xs text-[#D1D5DB]">
											{currentDate}
										</div>
									</div>
								)}

								<MessageItem 
									msg={msg} 
									currentUserId={currentUserId} 
									onDelete={handleDelete}
								/>
							</div>
						);
					})}
				</AnimatePresence>
				<div ref={messagesEndRef}></div>
			</div>

			<ChatInput socket={socket} chatId={chatId}/>
		</div>
	)

}

export default Chat;