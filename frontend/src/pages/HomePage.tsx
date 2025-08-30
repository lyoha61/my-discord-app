import { useState } from "react";
import Chat from "../components/Chat.js";
import { ChatList } from "../components/ChatList.js";
import { ChatListHeader } from "../components/ChatListHeader.js";
import Sidebar from "../components/Sidebar.js";

const HomePage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

	return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col bg-[#1A1A1A] border border-[#333333]">
        <ChatListHeader />
        <ChatList onSelectChat={setSelectedChatId}/>
      </div>
		  <div className="flex-1 flex-col max-h-screen items-center">
        <Chat chatId={selectedChatId}/>
      </div>
    </div>
     
	)
}

export default HomePage;