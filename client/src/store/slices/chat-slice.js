export const creatChatSlice = (set, get) => ({
  selectedChatType: undefined,  // Initial state for chat type
  selectedChatData: undefined,  // Initial state for chat data
  selectedChatMessages: [],     // Initial state for chat messages

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

  // Function to add a message
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    // Ensure chat type is defined before adding message
    if (!selectedChatType) {
      console.warn("No chat type selected. Cannot add message.");
      return;
    }

    // Log the message before processing
    console.log("Message before processing:", message);

    // Update selectedChatMessages by adding the new message
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
