

import User from "../models/UserModel.js"; 
import jwt from "jsonwebtoken";
import bcrypt from  "bcryptjs"; 
import { renameSync , unlinkSync} from "fs";

const maxAge = 3 * 24 * 60 * 60; 

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
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
    

    const user = await User.create({ email,password }); 
 
    // Ensure password hashing happens in the model
    response.cookie("jwt", createToken(email, user.id), {
      
      maxAge,
      secure: false, // Change to true in production
      sameSite: "Lax", // Change to "None" only if you serve from a different origin
    });
  

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message); 
    return response.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (request, response) => {
  
  try {
    const { email, password } = request.body;
    console.log(`email` , email);
  console.log(`password` , password);

    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ error: "User with given email not found" });
    }

    const auth = await bcrypt.compare(password, user.password);
    console.log(auth);
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
    console.error("Login error:", error.message);
    return response.status(500).json({ error: "Internal server error" });
  }
};

export const getUserInfo = async (request, response) => {
  try {
    console.log(`1`);
    const userId = request.user.userId;
console.log(`2`);
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
console.log(`3`);
    return response.status(200).json({
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
    console.log(`4`);
  } catch (error) {
    console.error("Get user info error:", error.message);
    return response.status(500).json({ error: "Internal server error" });
  }
};

export const userProfile = async (request, response) => {
  try {
    const userId = request.user.userId; 
    const { firstName, lastName, color } = request.body;

    if (!firstName || !lastName ) {
      return response.status(400).json({ error: "First name, last name, and color are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      request.user.userId, // Make sure you're using request.user.userId instead of request.userId
      { image: __filename },
      { new: true, runValidators: true }
    );
   

    if (!updatedUser) {
      return response.status(404).json({ error: "User not found" });
    }
    
    return response.status(200).json({
      id: updatedUser.id,
      email: updatedUser.email,
      profileSetup: updatedUser.profileSetup,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      image: updatedUser.image,
      color: updatedUser.color,
    });
  } catch (error) {
    console.error("User profile update error:", error.message);
    return response.status(500).json({ error: "Internal server error" });
  }
};


export const addProfileImage = async (request, response) => {
  console.log(`1`);
  
  try {
    console.log(request.body.user);
    console.log(request.file);
    
    if(!request.file){
      return response.status(400).send("File is Required");
    }
    console.log(`2`);
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname ;
    
    renameSync(request.file.path,fileName);
    
     const updatedUser= await User.findByIdAndUpdate(request.body.user,{image:fileName})
console.log(updatedUser);
    return response.status(200).json({
      
     image: updatedUser.image,
    });
    console.log(`3`);
  } catch (error) {
    console.error("User profile update error:", error.message);
    return response.status(500).json({ error: "Internal server error" });
  }
};
console.log(`4`);
export const removeProfileImage = async (request, response) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);
    if(!user) {
      return response.status(404).send("User not found");
    }
    if(user.image){
      unlinkSync(user.image)
    }
    user.image=null;  
    await user.save();

    return response.status(200).send("Profile removed successfully");
  }catch(error){
    console.log({error});
    return response.status(500).send("internal server err");
  }
  };