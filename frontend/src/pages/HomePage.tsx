import { useState } from "react";
import Chat from "../features/chat/Chat.js";
import { ChatList } from "../features/chat/ChatList.js";
import { ChatListHeader } from "../features/chat/ChatListHeader.js";
import Sidebar from "../components/Sidebar.js";

const HomePage: React.FC = () => {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

	return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col bg-[#1A1A1A] border border-[#333333]">
        <ChatListHeader onOpenChat={(chat) => setCurrentChatId(chat.id)} />
        <ChatList 
          onSelectChat={setCurrentChatId}
          selectedChatId={currentChatId}
        />
      </div>
		  <div className="flex-1 flex-col max-h-screen items-center">
        <Chat chatId={currentChatId}/>
      </div>
    </div>
     
	)
}

export default HomePage;