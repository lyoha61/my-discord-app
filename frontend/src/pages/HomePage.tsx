import Chat from "../components/Chat.js";
import Sidebar from "../components/Sidebar.js";

const HomePage: React.FC = () => {
	return (
    <div>
      <Sidebar />
		  <div className="flex flex-col h-[93vh] bg-[#202329] rounded-lg">
      <div className="vg p-4 chat-header text-left">Чат</div>
      <Chat />
    </div>
    </div>
     
	)
}

export default HomePage;