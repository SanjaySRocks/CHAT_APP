import { request, response } from "express";
import User from "../models/UserModel.js"; // Ensure this path is correct
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

// Helper function to create JWT
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

// Signup controller
export const signup = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Validate input
    if (!email || !password) {
      return response.status(400).send({ error: "Email and password are required" });
    }

    const user = await User.create({ email, password });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
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
    return response.status(500).send("Internal server error");
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Validate input
    if (!email || !password) {
      return response.status(400).send({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).send({ error: "User with given email not found" });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).send("Password is incorrect");
    }
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
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
    return response.status(500).send("Internal server error");
  }
};
