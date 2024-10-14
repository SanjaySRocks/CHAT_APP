export const creatChatSlice = (set, get) => ({
  selectedChatType: undefined,  // Initial state for chat type
  selectedChatData: undefined,  // Initial state for chat data
  selectedChatMessages: [],    // Initial state for chat messages

  // Function to set the selected chat type
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  // Function to set selected chat data
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  // Function to set selected chat messages
  setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),

  // Function to close chat and reset the state
  closeChat: () => set({
    selectedChatData: undefined,
    selectedChatType: undefined,
    selectedChatMessages: [],

  }),
addMessage:(message)=>{
  const selectedChatMessages = get().selectedChatMessages;
  const selectedChatType = get().selectedChatType;

  set({
    selectedChatMessages:[
      ...selectedChatMessages,{
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
    ]
  })
}

});
