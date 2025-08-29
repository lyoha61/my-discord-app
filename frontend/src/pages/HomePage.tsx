import Chat from "../components/Chat.js";
import ChatList from "../components/ChatListHeader.js";
import Sidebar from "../components/Sidebar.js";

const HomePage: React.FC = () => {
	return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatList />
		  <div className="flex-1 flex-col max-h-screen items-center">
        <Chat />
      </div>
    </div>
     
	)
}

export default HomePage;