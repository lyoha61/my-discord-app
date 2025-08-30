import { useEffect, useState } from "react";
import { getAvailableChats } from "../services/chatSevice"
import { ChatListUser } from "./ChatListUser";
import type { ChatResponse } from "shared/types/chat";


export const ChatList: React.FC< {onSelectChat: (chatId: number) => void} > = 
  ({ onSelectChat }) => {

  const [chats, setChats] = useState<ChatResponse[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getAvailableChats();
        setChats(data.chats);

      } catch (err) {
        console.error(err);
      }
    };
    fetchChats();
  }, []);
	

	return (
		<div>
      {chats.map(chat => (
        <div 
          key={chat.id}
          className="cursor-pointer"
          onClick={() => onSelectChat(chat.id)}
        >
          {chat.members.map(member => (
            <ChatListUser member={member}/>
          ))}
          
        </div>
      ))}
		</div>
	)
}