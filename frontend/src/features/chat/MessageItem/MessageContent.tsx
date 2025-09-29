import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ClientFile, ClientMessage } from "shared/types/message"
import CheckMark from "assets/icons/check-mark.svg?react";
import {useSocketContext} from "src/context/SocketContext.tsx";

interface MessageContentProps {
	msg: ClientMessage;
	isCurrentUser: boolean;
	isEditing: boolean;
	editText: string;
	setEditText: (text: string) => void;
	onEditSubmit: () => void;
}

function isClientFile(obj: unknown): obj is ClientFile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as { id: unknown }).id === 'string' &&
    'url' in obj &&
    typeof (obj as { url: unknown }).url === 'string'
  );
}

function getSafeFiles(files?: unknown): ClientFile[] {
  if (!Array.isArray(files)) return [];
  return files.filter(isClientFile);
}


export const MessageContent: React.FC<MessageContentProps> = ({
	msg,
	isCurrentUser,
	isEditing,
	editText,
	setEditText,
	onEditSubmit,
}) => {
	const [isMultiLine, setIsMultiLine] = useState(false);
	const [containerWidth, setContainerWidth] = useState("fit");

  const messageTextRef = useRef<HTMLDivElement>(null);
	const infoRef = useRef<HTMLDivElement>(null);
	const messageAllRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

  const hiddenSpanRef = useRef<HTMLSpanElement>(null);

	const files = getSafeFiles(msg.file);

	const time = new Date(msg.created_at).toLocaleTimeString([], {
		hour: '2-digit', 
		minute: '2-digit'
	});

  const { readMessage } = useSocketContext();

  useEffect(() => {
    const el = messageTextRef.current;
    if (!el || msg.read_at) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isCurrentUser) {
              try {
                readMessage({id: msg.id});
                observer.unobserve(el);
              } catch (err) {
                console.error(err);
              }
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

	// Check MultiLine
	useLayoutEffect(() => {
		const textEl = messageTextRef.current;

		if (textEl) {
			const style = window.getComputedStyle(textEl);
			const lineHeight = parseFloat(style.lineHeight);
			const height = textEl.getBoundingClientRect().height;

			setIsMultiLine(height > lineHeight * 1.5);
		}
	}, [msg.text, editText, isEditing]);

	// AutoSize TextArea
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

	const handleTextareaInput = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setEditText(e.target.value);
	}

	return (
		<div 
			ref = { messageAllRef }
			className={`relative flex max-w-[100%] min-w-[15%] text-sm pl-3 pr-1 pt-2  rounded-lg break-all ${
				isCurrentUser ? 'bg-[#5364E6] self-end' : 'bg-[#2A2A2A]'
			} ${isMultiLine ? 'flex-col pb-1' : 'flex-row pb-1'} ${
				containerWidth === 'full' ? 'w-full' : 'w-fit'
			}`}
		>
			{isEditing ?(
					<textarea
						ref={inputRef}
						value={editText}
						onChange={handleTextareaInput}
						onKeyDown={e => e.key === 'Enter' && onEditSubmit()}
						className="w-full text-sm outline-none resize-none  overflow-hidden px-0"
					/>
			) : (
				<>
					<span 
						ref={hiddenSpanRef}
						className="whitespace-pre-wrap break-words absolute invisible text-sm"
					/>

					<div className="flex-1" ref={messageTextRef}>
						{msg.text}
						{files.map(f => (
									<img key={f.id} src={f.url} alt="Picture" />
								))
						}
					</div>

					{/* Add info message  */}
					<div ref = {infoRef} className={`flex justify-end items-center text-xs text-[#ffffff] gap-1 py-1 whitespace-nowrap ${
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

						<div className="relative flex h-[80%] items-end">
							<CheckMark className={`w-3 fill-current ${
								msg.read_at  ? `text-[#4A90E2]` : 'text-[#fffff]'
							  }`}
              />
              {msg.read_at && (
                <CheckMark className={`absolute -top-0.5 w-2.5 fill-current text-[#4A90E2]`} />
              )}
						</div>
					</div>
				</>
			)}
		
		</div>
	)
}
