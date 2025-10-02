import React, {useRef, useState} from "react";
import PaperIcon from "../../assets/icons/paper-plane.png";
import type { WsMessageNew } from "shared/types/websocket/message.ts";
import { useSocketContext } from "src/context/SocketContext";
import PaperClipIcon from "assets/icons/paperclip.svg?react";
import { uploadFile } from "src/services/messageService";
import FileIcon from "assets/icons/file.svg?react";
import DeleteFileIcon from "assets/icons/xmark.svg?react";

interface ChatInputProps {
	chatId: string | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({chatId}) => {
	const { chatSocket, sendMessage, updateMessage } = useSocketContext();
	const [inputMessage, setInputMessage] = useState('');
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);
	const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileDialog = () => {
    inputRef.current?.click();
  }

	const handleSend = async () => {
		if(!chatSocket || !chatId || (!inputMessage.trim() && !file)) return;

		const payload: WsMessageNew = {
			text: inputMessage || '',
			chat_id: chatId,
		}

		const savedMessage = await sendMessage(payload);

		if (file) {
			setUploadProgress(0)
			try {
				const fileInfo = await uploadFile(chatId, savedMessage.id, file, (progress) => {
					setUploadProgress(progress);
				});
				updateMessage({
					id: savedMessage.id,
					file_id: fileInfo.id,
				});
			} catch (err) {
				console.error(err);
			} finally {
				setFile(null);
				setUploadProgress(null);
				if (inputRef.current) {
					inputRef.current.value = '';
				}
			}
		}
		setInputMessage('');
	}

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
		if (!selected) return;
		setFile(selected);
  }

	const handleDeleteFile = () => {
		setFile(null);
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	}

	return (
		<div className="flex p-3 bg-[#1A1A1A] h-auto">
			<div className="flex items-center h-full">
				<PaperClipIcon
					className="h-[70%] w-auto text-[#5364E6] fill-current mr-3 cursor-pointer"
					onClick={handleOpenFileDialog}
				/>
				<input
					type="file"
					ref={inputRef}
					onChange={handleFileSelect}
					className="hidden"
				/>
			</div>
			<div className="flex flex-1 bg-[#2A2A2A] rounded-lg pr-4 h-12">
				<input
					className="flex-1 px-4 py-2  focus:outline-none" 
					type="text"
					value={inputMessage}
					placeholder="Введите сообщение..." 
					onChange={(e) => setInputMessage(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
				/>
				{file && 
					<div className="flex flex-col max-w-[8%] w-[5%] overflow-hidden my-2 h-auto">
						<div className="relative flex max-h-[60%] w-fit justify-center">
							<FileIcon 
								className="w-10 max-h-full text-[#5364E6] fill-current" 
							/>
							<DeleteFileIcon 
								className="absolute top-0 -right-1 w-3 text-[#ffffff] fill-current cursor-pointer" 
								onClick={handleDeleteFile}
							/>
						</div>

						<span className="text-xs max-w-full h-[40%] truncate">{file.name}</span>
					</div>
				}
			</div>
			
			{uploadProgress !== null && (
				<div className="w-full h-1 bg-gray-700 rounded mt-2">
					<div 
						className="h-1 bg-green-500 rounded"
						style={{ width: `${uploadProgress}%` }}
					/>
				</div>
			)}
			<button 
				onClick={() => void handleSend()}
				className="ml-3 px-2 transition font-medium cursor-pointer"
				onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
			>
				<img className="h-6" src={PaperIcon} alt="" />
			</button>
		</div>
	)
}