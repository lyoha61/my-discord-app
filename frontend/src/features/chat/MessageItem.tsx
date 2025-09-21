import type { ClientMessage } from "shared/types/message"
import { AnimatePresence, motion} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSocketContext } from "src/context/SocketContext";
import CheckMark from "assets/icons/check-mark.svg?react";

interface MessageItemProps {
	msg: ClientMessage;
	currentUserId: number;
}

export const MessageItem: React.FC<MessageItemProps> = ({
	msg, 
	currentUserId, 
}) => {
	const isCurrentUser = msg.author_id === currentUserId;
	const time = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
	const { updateMessage, deleteMessage, readMessage } = useSocketContext();
	const [hovered, setHovered] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(msg.text);
	const [isMultiLine, setIsMultiLine] = useState(false);
	const [containerWidth, setContainerWidth] = useState("fit");

	const infoRef = useRef<HTMLDivElement>(null);
	const messageAllRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const hiddenSpanRef = useRef<HTMLSpanElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const messageContainerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const textEl = messageContainerRef.current;

		if (textEl) {
			const style = window.getComputedStyle(textEl);
			const lineHeight = parseFloat(style.lineHeight);
			const height = textEl.getBoundingClientRect().height;

			setIsMultiLine(height > lineHeight * 1.5);
		}
	}, [msg.text, editText, isEditing]);

	useEffect(() => {
		const el = messageContainerRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting && !isCurrentUser) {
						readMessage({id: msg.id});
						observer.unobserve(el);
					}
				})
			},
			{ threshold: 0.7 }
		);

		observer.observe(el);

		return () => {
			observer.disconnect();
		}
	}, [msg, readMessage, isCurrentUser]);

	useEffect(() => {
		if(inputRef.current && isEditing) {
			const textarea = inputRef.current;
			setContainerWidth("full");
			textarea.style.boxSizing = "border-box";
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
			textarea.focus();
		} else if (!isEditing) {
			setContainerWidth('fit');
		}
	}, [isEditing, editText]);

	const handleEditSubmit = async () => {
		if (editText.trim() && editText !== msg.text) {
			await updateMessage({
				text: editText.trim(),
				id: msg.id,
			});
			msg.text = editText.trim();
		}
		setIsEditing(false);
	}

	const handleDelete = async () => {
		try {
			await deleteMessage({id: msg.id})
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error(`Error delete message ${msg.id} error: ${err.message}`)
			} else {
				console.error(`Error delete message ${msg.id}`)
			}
		}
	};

	const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditText(e.target.value)
	}

	return (
		<div 
			className={`relative flex pt-6  ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Message */}
			<motion.div 
				className='flex flex-col flex-1 items-start max-w-[55%]'
				ref={containerRef}
				whileHover={{ scale: 1.02 }}
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 20, scale: 0.95 }}
				transition={{ duration: 0.25 }}
			>
				{/* Nickname */}
				<div className={`text-xs font-medium mb-1 ${isCurrentUser ? '' : 'text-gray-400'}`}>
					{isCurrentUser ? '' : `${msg.author_name}`}
				</div>

				{/* Message text / Input */}
				<div ref = { messageAllRef }
					className={`relative flex max-w-[100%] min-w-[15%] text-sm pl-3 pr-1 pt-2  rounded-lg break-all ${
						isCurrentUser ? 'bg-[#5364E6] self-end' : 'bg-[#2A2A2A]'
					} ${isMultiLine ? 'flex-col pb-1' : 'flex-row pb-1'} ${
						containerWidth === 'full' ? 'w-full' : 'w-fit'
					}`
				}
				>
					{isEditing ?(
						<>
							<textarea
								ref={inputRef}
								value={editText}
								onChange={handleTextareaInput}
								onKeyDown={e => e.key === 'Enter' && handleEditSubmit()}
								className="w-fit w-full text-sm outline-none resize-none  overflow-hidden px-0"
							/>
						</>
					) : (
						<>
							<span 
								ref={hiddenSpanRef}
								className="whitespace-pre-wrap break-words absolute invisible text-sm"
							/>

							<div className="flex-1" ref={messageContainerRef}>
								{msg.text}
							</div>

							{/* Add info message  */}
							<div ref = {infoRef} className={`flex justify-end items-end text-xs text-[#ffffff] gap-1 py-1 whitespace-nowrap ${
								isMultiLine ? "" : 'ml-2'
							}`}>
								
								<div>
									{msg.created_at === msg.updated_at 
										? ''
										: 'изменено'
									}
								</div>

								<div 
								className={`${
									isCurrentUser ? 'self-end' : 'self-start'
								}`}
								>
									{time}
								</div>

								<div className="flex h-[80%] items-end">
									<CheckMark className={`w-3.5 fill-current ${
										msg.read_at ? 'text-[#4A90E2]' : 'text-[#cccc]'
									}` } />
								</div>
							</div>
						</>
					)}
				
				</div>
			</motion.div>

			{/* Actions */}
			<AnimatePresence>
				{hovered && !isEditing && (
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