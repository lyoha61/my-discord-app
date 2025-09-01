import { useEffect, useState } from "react";
import { getAvailableChats } from "../../services/chatSevice"
import { UserCard } from "../../components/UI/UserCard";
import type { ChatResponse } from "shared/types/chat";


export const ChatList: React.FC<{
  onSelectChat: (chatId: number) => void,
  selectedChatId: number | null
}> = ({ onSelectChat, selectedChatId }) => {

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
          >
            {chat.members.map(member => (
              <UserCard 
                member={member} 
                isSelected={chat.id === selectedChatId}
                onClick={() => onSelectChat(chat.id)}
              />
            ))}
          </div>
      ))} 
		</div>
	)
}