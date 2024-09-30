import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast for notifications

const Chat = () => {
  const { userInfo } = useAppStore(); // Correctly call useAppStore
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user profile is set up
    if (!userInfo || !userInfo.profileSetup) { // Ensure userInfo exists
      toast('Please set up your profile to continue');
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div>Chat</div>
  );
};

export default Chat;
