import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import apiClient from "@/lib/api-client";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // Ensure correct import
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
 // Ensure apiClient is imported

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore(); // Destructure setUserInfo
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
      if (response.status === 200) {
        setUserInfo(null); // Clear user info on logout
        navigate("/auth"); // Navigate to the authentication page
      }
    } catch (error) {
      console.error("Logout error:", error); // Improved error logging
    }
  };

  const getColor = (color) => {
    return color || "bg-gray-500"; // Fallback color
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center">
        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
          {userInfo.image ? (
            <AvatarImage
              src={`${HOST}/${userInfo.image}`} // Use the uploaded image
              alt="profile"
              className="object-cover w-full h-full bg-black"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/path/to/default-image.png'; // Path to default image
              }}
            />
          ) : (
            <div
              className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}
            >
              {userInfo.firstName ? userInfo.firstName.charAt(0) : userInfo.email.charAt(0)}
            </div>
          )}
        </Avatar>
        <div className="text-lg text-white">
          {userInfo.firstName && userInfo.lastName 
            ? `${userInfo.firstName} ${userInfo.lastName}` 
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2 className="text-purple-500 text-xl font-medium" 
                onClick={() => navigate('/profile')}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp className="text-red-500 text-xl font-medium" 
                onClick={logOut} // Ensure logOut is called here
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
