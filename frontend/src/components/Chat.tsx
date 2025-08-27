import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"
import { fetchMessages } from "../services/messageService";
import type { Message } from "shared/types/message";

const Chat: React.FC = () => {
	const currentUserId = 2;
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const socket = useSocket();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchMessages();
				setMessages(data.messages);        
			} catch (err) {
				console.error(err);
			}
		};
		fetchData();
		if(!socket) return;
		
		socket.on('message', (message: Message) => {
			setMessages(prev => [...prev, message])
		});

		return () => {
			socket.off('message');
		}
	}, [socket]);

	const sendMessage = () => {
		if(!inputMessage.trim() || !socket) return;

		socket.emit('message', {text: inputMessage});
		setInputMessage('')
	}

	return (
		<div className="flex flex-col w-full h-full  text-white  shadow-lg">
			<div className="flex-1 p-4 space-y-3">
				{messages.map((msg) => (
					<div 
						key={msg.id} 
						className={`flex ${
							msg.author_id === currentUserId
							? 'justify-end'
							: 'justify-start'
						}`}
					>
						
						<div className={`max-w-xs px-4 py-2 rounded-2xl ${
							msg.author_id === currentUserId
								? 'bg-[#6b8afd] text-white rounded-br-none'
								: 'bg-[#2E343D] text-white rounded-bl-none'
							}`}>
							<div className={`text-xs font-medium mb-1 ${
								msg.author_id === currentUserId ? 'text-blue-100' : 'text-gray-400'
								}`}>
								{msg.author_id === currentUserId ? 'Вы' : `User ${msg.author_id}`}
							</div>
							<div className="text-sm">{msg.text}</div>
						</div>
					</div>
				))}
			</div>
			<div className="flex p-3">
				<input
					className="flex-1 px-4 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 " 
					type="text"
					value={inputMessage}
					placeholder="Введите сообщение..." 
					onChange={(e) => setInputMessage(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
				/>
				<button 
					onClick={sendMessage}
					className="ml-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium"
				>
					Отправить
				</button>
			</div>
		</div>
	)

}

export default Chat;