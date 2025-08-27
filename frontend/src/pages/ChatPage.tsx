import Chat from "../components/Chat";

const ChatPage: React.FC = () => {
	return (
		  <div className="chat-container">
      <div className="chat-header">Чат</div>
      <Chat />
      {/* <MessageList messages={messages} /> */}
      {/* <MessageInput onSendMessage={handleSendMessage} /> */}
      {/* <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div> */}
    </div>
	)
}

export default ChatPage;