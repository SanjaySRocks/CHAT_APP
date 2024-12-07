export const creatChatSlice = (set, get) => ({
  selectedChatType: undefined,  // Initial state for chat type
  selectedChatData: undefined,  // Initial state for chat data
  selectedChatMessages: [],     // Initial state for chat messages
directMessageContacts:[],
isUploading:false,
isDownloading:false,
fileUploadProgress:0,
fileDownloadProgress:0,
channels:[],
setChannels:(channels)=>set({channels}),
setIsUploading: (isUploading) => set({ isUploading }),
setIsDownloading: (isDownloading) => set({ isDownloading }),
setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
setFileDownloadProgress: (fileDownloadProgress) =>
  set({ fileDownloadProgress }),
  // Function to set the selected chat type
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  // Function to set selected chat data
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  // Function to set selected chat messages
  setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),

  setDirectMessagesContacts:(directMessageContacts)=>set({ directMessageContacts }),

addChannel:(channel)=>{
  const channels = get().channels;
  set({ channels: [channel, ...channels] });
},
  addChannel:(channel)=>{
    const channels = get().channels;
    set({channels:[channel,...channels]});
  },
  // Function to close chat and reset the state
  closeChat: () => set({
    selectedChatData: undefined,
    selectedChatType: undefined,
    selectedChatMessages: [],
  }),

  // Function to add a message
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

   
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,

          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });

    // Log the messages after adding
    console.log("Messages after adding new one:", get().selectedChatMessages);
  }
});
