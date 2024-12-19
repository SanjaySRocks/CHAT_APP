import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  // Helper to render the avatar
  const renderAvatar = () => {
    if (selectedChatType === "contact") {
      // Check if image, firstName, and lastName exist
      const hasValidImage = selectedChatData?.image;
      const hasValidName = selectedChatData?.firstName && selectedChatData?.lastName;

      return hasValidImage ? (
        <AvatarImage
          src={`${HOST}/${selectedChatData.image}`} // Load user's uploaded image
          alt={`${selectedChatData.firstName} ${selectedChatData.lastName}`}
          className="object-cover w-full h-full bg-black"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite error loop
            e.target.src = "/path/to/default-image.png"; // Replace with default image path
          }}
        />
      ) : hasValidName ? (
        <div
          className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(
            selectedChatData.color || "defaultColor"
          )}`}
        >
          {selectedChatData.firstName.charAt(0)}
        </div>
      ) : (
        <div
          className="uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full bg-gray-400"
        >
          {selectedChatData?.email?.charAt(0) || "?"}
        </div>
      );
    }

    // Placeholder avatar for non-contact chat types (e.g., channels)
    return (
      <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
        #
      </div>
    );
  };

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {renderAvatar()}
            </Avatar>
          </div>

          <div>
            {selectedChatType === "channel" && selectedChatData?.name}
            {selectedChatType === "contact" && selectedChatData ? (
              `${selectedChatData.firstName} ${selectedChatData.lastName}`
            ) : (
              <span></span> 
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
            aria-label="Close Chat"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
