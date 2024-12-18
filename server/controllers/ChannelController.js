import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const userId = request.user.userId;

    console.log("Incoming Request Data:", { name, members });
    console.log("User ID from Token:", userId);   

    // Check if the admin user exists
    const admin = await User.findById(userId);
    if (!admin) {
      return response.status(400).send("Admin user not found.");
    }

    // Find all valid members
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return response.status(400).send("Some members are not valid users.");
    }

    // Create the new channel
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    // Save the new channel
    await newChannel.save();
    return response.status(201).json({ channel: newChannel });

  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server error");
  }
};
export const getUserChannels = async (request, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId } , { members: userId }],
    }).sort({ updatedAt: -1 });


    // Return the created channel
    return response.status(201).json({ channels });

  } catch (error) {
    console.log({ error });



    return response.status(500).send("Internal server error");
  }
};

