import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store"; // Make sure this import is correct
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  // Ensure that you are destructuring both selectedChatType and setSelectedChatType from the store
  const { closeChat, selectedChatData, selectedChatType, setSelectedChatType } = useAppStore();

  // Ensure selectedChatData is valid before using it
  const hasSelectedChatData = selectedChatData && selectedChatData.image && selectedChatData.firstName && selectedChatData.lastName;

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            {hasSelectedChatData ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`} // Use the uploaded image
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/path/to/default-image.png"; // Path to default image
                  }}
                />
              </Avatar>
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(
                  selectedChatData?.color || 'defaultColor' // Default color if undefined
                )}`}
              >
                {selectedChatData?.firstName
                  ? selectedChatData.firstName.charAt(0)
                  : selectedChatData?.email?.charAt(0) || "?"} {/* Fallback to '?' */}
              </div>
            )}
          </div>

          <div>
            {/* Ensure safe checking of selectedChatType and selectedChatData */}
            {selectedChatType === "contact" && selectedChatData ? (
              `${selectedChatData.firstName} ${selectedChatData.lastName}`
            ) : (
              <span>No contact selected</span> // Fallback message
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
