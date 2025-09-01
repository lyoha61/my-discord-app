import Input from "../../components/UI/Input"
import SearchIcon from "../../assets/icons/search.png";
import { useEffect, useRef, useState } from "react";
import { getUsers } from "src/services/userService";
import type { UserResponse } from "shared/types/user";
import { UserCard } from "../../components/UI/UserCard";
import { motion } from "framer-motion";
import type { ChatResponse } from "shared/types/chat";
import { getOrCreatePrivateChat } from "src/services/chatSevice";

export const UserSearch: React.FC<{ 
	onClose: () => void;
	onOpenChat: (chat: ChatResponse) => void
}> = ({ onClose, onOpenChat }) => {

	const [users, setUsers] = useState<UserResponse[]>([]);
	const modalRef = useRef<HTMLDivElement>(null);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if(modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
	}

	const handleUserClick = async (user: UserResponse) => {
		const chat = await getOrCreatePrivateChat(user.id);
		onOpenChat(chat);
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if(e.key === "Escape") onClose();
			
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose])

	useEffect(() => {
		const fetchUsers = async () => {
			const data = await getUsers();
			setUsers(data.users);
		}
		fetchUsers();
	}, [])


	return (
			<motion.div
				className="fixed flex inset-0 bg-black/50  justify-center items-center"
				onClick={handleOverlayClick}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				style={{ backdropFilter: "blur(8px)" }}
				transition={{ duration: 0.2 }}	
			>
				<motion.div 
					ref={modalRef} 
					className="bg-[#1A1A1A] border-1 border-[#393939] rounded-2xl shadow-lg w-[500px] h-[600px]"
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{duration: 0.2 }}
				>
				
					<div className="flex flex-col gap-1 p-6 border-b border-[#393939] ">
						<h2 className="font-semibold text-lg">Поиск пользователей</h2>
						<p className="text-sm text-gray-400">Выбери кого-то, чтобы начать диалог</p>
					</div>

					<div className="p-6 border-b border-[#393939]">
						<Input
							id="user-search" 
							label="Введите имя"
							className="h-10"
							icon={<img className="h-4" src={SearchIcon} />}
						/>
					</div>

					<div>
						{users.map(user => (
							<UserCard 
								key={user.id}
								member={user} 
								additionalText={user.username}
								onClick={() => handleUserClick(user)}
							/>
						))}
					</div>

				</motion.div>
			</motion.div>
		
	)
}