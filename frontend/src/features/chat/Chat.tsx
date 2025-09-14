import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import type { ClientMessage, MessageNewEvent, MessageUpdateEvent } from "shared/types/message";
import { deleteMessage, getMessages } from "../../services/messageService";
import { getCurrentUserId } from "src/services/authService";
import { AnimatePresence } from "framer-motion";
import { formatDate } from "src/utils/formatDate";
import { MessageItem } from "./MessageItem";
import { ChatInput } from "./ChatInput";
import { EVENTS } from "shared/events";
import { ChatHeader } from "./ChatHeader";

const Chat: React.FC<{ chatId: number | null }> = ({ chatId }) => {
	const currentUserId = getCurrentUserId();
	const [messages, setMessages] = useState<ClientMessage[]>([]);
	
	const { chatSocket } = useSocketContext();

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
		
		if(!chatSocket) return;
		
		chatSocket.on(EVENTS.MESSAGE_NEW, (message: MessageNewEvent) => {
			setMessages(prev => [...prev, message])
		});

		chatSocket.on(EVENTS.MESSAGE_UPDATE, (updatedMsg: MessageUpdateEvent) => {
			setMessages(prev => 
				prev.map(msg => 
					msg.id === updatedMsg.id ? {...msg, ...updatedMsg} : msg
				)
			)
		})

		return () => {
			chatSocket.off(EVENTS.MESSAGE_NEW);
		}
	}, [chatSocket, chatId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages]);

	if (!currentUserId) {
		// TODO: перекидывать на страницу 401
		return <div>Пожалуйста, войдите, чтобы открыть чат</div>
	}

	const handleDelete = async (chatId: number, messageId: number) => {
		await deleteMessage(chatId, messageId);
		setMessages(prev => prev.filter(m => m.id !== messageId));
	}
	
	if (!chatId) return; 

	return (
		<div className="flex flex-col h-full w-full  text-white  shadow-lg">
			<ChatHeader chatId={chatId}/>
			{/* Messages */}
			<div className="flex-1 flex flex-col p-4 bg-[#0B0B0B] overflow-auto scrollbar-hidden">
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

			<ChatInput chatId={chatId}/>
		</div>
	)

}

export default Chat;