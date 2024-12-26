import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import apiClient from "@/lib/api-client";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const [isDownloading, setIsDownloading] = useState(false);
  const [fileDownloadProgress, setFileDownloadProgress] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedChatData?._id) return;
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedChatType === "contact") getMessages();
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (file) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    try {
      const response = await apiClient.get(`${HOST}/${file}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted);
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", file.split("/").pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);

      setIsDownloading(false);
      setFileDownloadProgress(0);
    } catch (error) {
      console.error("Failed to download file:", error);
      setIsDownloading(false);
    }
  };

  const renderMessages = () => {
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
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-right" : "text-left"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender === selectedChatData._id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                className="max-h-[300px] max-w-full"
                alt="Message Attachment"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <MdFolderZip className="text-3xl text-black/60" />
              <span>{message.fileUrl.split("/").pop()}</span>
              <IoMdArrowRoundDown
                className="text-2xl cursor-pointer"
                onClick={() => downloadFile(message.fileUrl)}
              />
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessage = (message) => {
    const sender = message.sender;

    return (
      <div
        className={`mt-5 ${
          message.sender._id === userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id !== userInfo._id
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {sender._id !== userInfo._id && (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {sender.image ? (
                <AvatarImage
                  src={`${HOST}/${sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <AvatarFallback
                  className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${
                    sender.color || "bg-gray-500 text-white"
                  }`}
                >
                  {sender.firstName
                    ? sender.firstName.charAt(0)
                    : sender.email.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm text-white/60">{`${sender.firstName} ${sender.lastName}`}</span>
          </div>
        )}
        <span className="text-xs text-white/60 mt-1">
          {moment(message.timestamp).format("LT")}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8">
      {renderMessages()}
      <div ref={scrollRef} />

      {isDownloading && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-200">
          <div
            className="bg-blue-500 text-white text-center text-xs leading-none py-1"
            style={{ width: `${fileDownloadProgress}%` }}
          >
            {fileDownloadProgress}%
          </div>
        </div>
      )}

      {showImage && (
        <div className="fixed z-[1000] inset-0 flex items-center justify-center backdrop-blur-lg">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="max-h-[80vh] max-w-full"
              alt="Preview"
            />
          </div>
          <div className="flex gap-5 mt-5">
            <IoMdArrowRoundDown
              className="text-2xl cursor-pointer"
              onClick={() => downloadFile(imageURL)}
            />
            <IoCloseSharp
              className="text-2xl cursor-pointer"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
