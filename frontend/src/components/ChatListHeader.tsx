import Input from "./UI/Input.js";
import { UserSearch } from "./UserSearch.js";
import AddIcon from "../assets/icons/add-white.png";
import searchIcon from "../assets/icons/search.png";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ChatResponse } from "shared/types/chat.js";

export const ChatListHeader: React.FC = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [currentChat, setCurrentChat] = useState<ChatResponse | null>(null);

	const openSearch = () => setIsSearchOpen(true);
	const closeSearch = () => setIsSearchOpen(false);

	return (
		<div className="flex flex-col p-6 border-b border-[#333333]">
			<div className="flex w-full justify-between items-center mb-6 mt-2">
				<span className="font-semibold" >Сообщения</span>
				<img 
					className="h-6 cursor-pointer transform transition-all duration-300 hover:scale-110" 
					src={AddIcon} 
					alt="" 
					onClick={() => openSearch()}
				/>
			</div>
			
			<Input
				id='chat-search' 
				label="Поиск по сообщениям"
				className="h-9"
				icon={<img className="h-5" src={searchIcon} />}
			/>

		<AnimatePresence>
			{isSearchOpen && (
				<motion.div
					className="z-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<UserSearch 
						onClose={closeSearch}
						onOpenChat={(chat) => {
							setCurrentChat(chat);
							closeSearch()
						}}
					/>
				</motion.div>
				
			)} 
		</AnimatePresence>
		

		</div>
	)
}