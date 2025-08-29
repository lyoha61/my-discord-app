import { useEffect, useState } from "react";
import { getAvailableChats } from "../services/chatSevice"
import { ChatListUser } from "./ChatListUser";

export const ChatList: React.FC = () => {
  const [chats, setChats] = useState();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getAvailableChats(1);
        setChats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
  }, []);
	
	return (
		<div>
			<ChatListUser/>
		</div>
	)
}