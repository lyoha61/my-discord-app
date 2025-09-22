import {useEffect, useState} from "react";
import { ChatList } from "../features/chat/ChatList.js";
import { ChatListHeader } from "../features/chat/ChatListHeader.js";
import Sidebar from "../components/Sidebar.js";
import { UserProfile } from "src/features/user/UserProfile.js";
import type {ChatResponse} from "shared/types/chat.js";
import Chat from "src/features/chat/Chat.tsx";
import {getAvailableChats} from "src/services/chatSevice.ts";

export const HomePage: React.FC = () => {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [chats, setChats] = useState<ChatResponse[]>([]);

  const handleNewChat = (chat: ChatResponse) => {
    setChats(prev => [...prev, chat]);
    console.log(chat);
    console.log(chats);
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
    fetchChats();
  }, []);

	return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col justify-between bg-[#1A1A1A] border border-[#333333]">
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
		  <div className="flex-1 flex-col max-h-screen items-center">
        <Chat chatId={currentChatId}/>
      </div>
    </div>
     
	)
}