import User from "../models/UserModel.js";
import mongoose from "mongoose";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (!searchTerm) {  // Better check for empty searchTerm
      return response.status(400).send("searchTerm is required.");
    }

    // Sanitize the search term
    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^{}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(sanitizedSearchTerm, "i");

    // Search for contacts
    const contacts = await User.find({
      _id: { $ne: request.userId },
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex }
      ],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server error.");
  }
};


export const getContactsForDMList = async (request, response, next) => {
  try {
    let { userId } = request;   
    userId = new mongoose.Types.ObjectId(userId);  // Ensure userId is a valid ObjectId

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },  // Sort by latest messages
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },  // Use "$timestamp" to get the last message's time
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",  // Unwind to access the contactInfo array
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
      $sort: { lastMessageTime: -1 },
    },
    ]);

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server error.");
  }
};


export const getAllContacts = async (request, response, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: request.userId} },
      "firstName lastName _id email"
    );
const contacts = users.map((user) => ({
  label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
  
}));

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server error.");
  }
};


