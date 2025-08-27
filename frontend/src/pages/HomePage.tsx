import Chat from "../components/Chat.js";

const HomePage: React.FC = () => {
	return (
		  <div className="flex flex-col h-[93vh] bg-[#202329] rounded-lg">
      <div className="vg p-4 chat-header text-left">Чат</div>
      <Chat />
      {/* <MessageList messages={messages} /> */}
      {/* <MessageInput onSendMessage={handleSendMessage} /> */}
      {/* <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div> */}
    </div>
	)
}

export default HomePage;