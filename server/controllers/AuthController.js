import { request, response } from "express";
import User from "../models/UserModel.js"; // Ensure this path is correct
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

// Helper function to create JWT
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

// Signup controller
export const signup = async (request, response) => {
  const { email, password } = request.body;

  // Validate input
  if (!email || !password) {
    return response.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({ email, password });

    // Create JWT token
    const token = createToken(email, newUser._id);

    // Set cookie with the token
    response.cookie("jwt", token, {
      maxAge: maxAge * 1000, // milliseconds
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "None", // Allow cross-origin requests
    });

    return response.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        profileSetup: newUser.profileSetup,
      },
      token, // Optionally send the token in the response
    });
  } catch (error) {
    console.error("Error in signup:", error); // Log error for debugging
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
