import {useEffect, useState} from "react";
import { ChatList } from "../features/chat/ChatList.js";
import { ChatListHeader } from "../features/chat/ChatListHeader.js";
// import Sidebar from "../components/Sidebar.js";
import { UserProfile } from "src/features/user/UserProfile.js";
import type {ChatResponse} from "shared/types/chat.js";
import Chat from "src/features/chat/Chat.tsx";
import {getAvailableChats} from "src/services/chatService.js";

export const HomePage: React.FC = () => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatResponse[]>([]);

  const handleNewChat = (chat: ChatResponse) => {
    setChats(prev => [...prev, chat]);
    setCurrentChatId(chat.id);
  }

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getAvailableChats();
        setChats(data.chats);

        if (data.chats.length > 0) {
          setCurrentChatId(data.chats[0].id);
        }

      } catch (err) {
        console.error(err);
      }
    };
    fetchChats().catch(err => console.error(err));
  }, []);

	return (
    <div className="flex h-screen max-w-full">
      {/* <Sidebar /> */}
      <div className="flex flex-col justify-between bg-[#1A1A1A] border border-[#333333] w-auto overflow-auto max-w-[30%]">
        <div>
          <ChatListHeader onOpenChat={handleNewChat} />
          <ChatList
            chats={chats}
            onSelectChat={setCurrentChatId}
            selectedChatId={currentChatId}
          />
        </div>

        <UserProfile />

      </div>
		  <div className="flex-1 flex-col max-h-screen max-w-full overflow-hidden items-center">
        <Chat chatId={currentChatId}/>
      </div>
    </div>
     
	)
}