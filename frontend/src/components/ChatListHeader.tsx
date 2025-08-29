import Input from "./UI/Input.js";
import AddIcon from "../assets/icons/add-white.png"
import searchIcon from "../assets/icons/search.png"

const ChatListHeader: React.FC = () => {
	return (
		<div className="flex flex-col bg-[#1A1A1A] px-6 pt-6">
			<div className="flex w-full justify-between items-center mb-6 mt-2">
				<span className="font-semibold" >Сообщения</span>
				<img className="h-6 cursor-pointer transform transition-all duration-300 hover:scale-110" src={AddIcon} alt="" />
			</div>
			
			<Input
				id='chat-search' 
				label="Поиск по сообщениям"
				className="h-9"
				icon={<img className="h-5" src={searchIcon} />}
			/>
		</div>
	)
}

export default ChatListHeader;