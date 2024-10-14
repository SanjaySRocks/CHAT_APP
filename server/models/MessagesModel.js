import mongoose from "mongoose";
// import User from "./usermodel.js"; // Correct path and file extension


const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Use "User" (singular) instead of "Users"
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Use "User" (singular) here as well
    required: false, // Optional if sending to a channel or group
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function() {
      return this.messageType === "text";
    },
  },
  fileUrl: {
    type: String,
    required: function() {
      return this.messageType === "file";
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Fixing model name typo and exporting
const Message = mongoose.model("Messages", messageSchema);
export default Message;
