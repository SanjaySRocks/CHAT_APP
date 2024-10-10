import User from "../models/UserModel.js";

export const searchContacts = async (request, response) => {
  try {
    const { searchTerm } = request.body;

    // Validate search term
    if (!searchTerm) {
      return response.status(400).send("searchTerm is required.");
    }

    // Sanitize the search term
    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^{}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(sanitizedSearchTerm, "i");

    // Search for contacts
    const contacts = await User.find({
      $and: [{ _id: { $ne: request.userId } }],
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
      ],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error({ error });
    return response.status(500).send("Internal server error.");
  }
};
