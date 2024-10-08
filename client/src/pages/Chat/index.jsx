import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast for notifications
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo, activeChat } = useAppStore(); // Include activeChat from store
  const navigate = useNavigate();

  useEffect(() => {
    console.log("chat", userInfo);
    if (!userInfo || !userInfo.profileSetup) {
      toast('Please set up your profile to continue');
      navigate("/profile");
    }
  }, [userInfo]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
       <ChatContainer /> 
         {/* <EmptyChatContainer />   */}
    </div>
  );
};

export default Chat;
