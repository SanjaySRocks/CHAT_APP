import { request, response } from "express";
import User from "../models/UserModel.js"; 
import jwt from "jsonwebtoken";
import { compare, hash } from "bcrypt"; 

const maxAge = 3 * 24 * 60 * 60; 

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ error: "User with given email not found" });
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).json({ error: "Password is incorrect" });
    }

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error: "Internal server error" });
  }
};

export const getUserInfo = async (request, response) => {
  try {
    
    const userId = request.user.userId; // Get user ID from the token

    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    return response.status(200).json({
      
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
    
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error: "Internal server error" });
  }
};
