import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef } from "react";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo,selectedChatMessages } = useAppStore();

  // Check if messages are being populated correctly
  console.log("Messages:", selectedChatMessages);
  console.log("User Info:", userInfo);
  console.log("Selected Chat Data:", selectedChatData);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);  // Slight delay to ensure messages are rendered before scrolling
    return () => clearTimeout(timer);
  }, [selectedChatMessages]); 

  const renderMessages = () => {
    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return <div className="text-center text-gray-500 my-4">No messages available.</div>;
    }

    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div className={`${message.sender === userInfo._id ? "text-right" : "text-left"}`}>
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender === userInfo._id
              ? "bg-[#8417ff]/20 text-[#8417ff]/90 border-[#841755]/50"
              : "bg-[#2a2b33] text-white/80 border-[#fffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      <div className="text-xs text-gray-500 mt-1">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full bg-[#0d0d0d]">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
