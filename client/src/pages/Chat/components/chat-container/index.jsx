import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";

import MessageContainer from "./components/message-container";
const ChatContainer = () => {
  return (
    <div className="h-[100vh] w-full flex flex-col bg-[#1c1d25]">

      <ChatHeader />
      <MessageContainer />
      <MessageBar /> 
    </div>
  );
};

export default ChatContainer;
