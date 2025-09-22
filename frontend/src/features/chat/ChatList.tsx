import { UserCard } from "../../components/UI/UserCard";
import type { ChatResponse } from "shared/types/chat";
import {getCurrentUserId} from "src/services/authService.ts";

export const ChatList: React.FC<{
  chats: ChatResponse[];
  onSelectChat: (chatId: number) => void;
  selectedChatId: number | null;
}> = ({ chats, onSelectChat, selectedChatId }) => {
  const currentUseId = getCurrentUserId();

	return (
		<div>
      {chats.map(chat => (
          <div 
            key={chat.id}
            className="cursor-pointer"
          >
            {chat.members.map(member => (
              member.id === currentUseId  ? null :
              <UserCard
                key={member.id}
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