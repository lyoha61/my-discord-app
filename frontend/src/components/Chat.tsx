import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"
import { fetchMessages } from "../services/messageService";
import type { Message } from "shared/types/message";

const Chat: React.FC = () => {
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
		setInputMessage("");
	}

	return (
		<div className="flex flex-col w-full h-full bg-gray-900 text-white rounded-lg shadow-lg">
			<div className="flex-1 p-4 space-y-3">
				{messages.map((msg) => (
					<div key={msg.id} className="message">
						<span>{msg.authorId}</span>
						<span>{msg.text}</span>
					</div>
				))}
			</div>
			<div className="flex p-3 border-t border-gray-700">
				<input
					className="flex-1 px-3 py-2" 
					type="text"
					value={inputMessage}
					placeholder="Введите сообщение..." 
					onChange={(e) => setInputMessage(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
				/>
				<button onClick={sendMessage}>Отправить</button>
			</div>
		</div>
	)

}

export default Chat;