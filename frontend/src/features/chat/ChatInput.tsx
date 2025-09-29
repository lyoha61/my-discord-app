import React, {useRef, useState} from "react";
import PaperIcon from "../../assets/icons/paper-plane.png";
import type { WsMessageNew } from "shared/types/websocket/message.ts";
import { useSocketContext } from "src/context/SocketContext";
import PaperClipIcon from "assets/icons/paperclip.svg?react";
import { uploadFile } from "src/services/messageService";

interface ChatInputProps {
	chatId: string | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({chatId}) => {
	const { chatSocket, sendMessage, updateMessage } = useSocketContext();
	const [inputMessage, setInputMessage] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileDialog = () => {
    inputRef.current?.click();
  }

	const handleSend = async () => {
		if(!chatSocket || !chatId || (!inputMessage.trim() && !file)) return;

		const payload: WsMessageNew = {
			text: inputMessage || '',
			chat_id: chatId
		}
		const savedMessage = await sendMessage(payload);

		if (file) {
			const fileInfo = await uploadFile(chatId, savedMessage.id, file);
			updateMessage({
				id: savedMessage.id, 
				file_id: fileInfo.id,
			});
		}
		setInputMessage('');
		setFile(null)
	}

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
		setFile(selected);
  }

	return (
		<div className="flex p-3 bg-[#1A1A1A]">
      <div className="flex items-center min-w-[10%] max-h-[100%]">
        <PaperClipIcon
          className="h-[70%]  text-[#5364E6] fill-current mr-4 cursor-pointer"
          onClick={handleOpenFileDialog}
        />
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
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