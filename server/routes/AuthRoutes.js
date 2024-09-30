import { Router } from "express";
import { login, signup, getUserInfo } from "../controllers/AuthController.js"; // Import getUserInfo
import { verifyToken } from "../middleware/AuthMiddleware.js"; // Import verifyToken middleware

const authRoutes = Router(); 

// Define the signup and login routes
authRoutes.post("/signup", signup);
authRoutes.post("/login", login); 

// Define the protected route for user info
authRoutes.get("/user-info", verifyToken, getUserInfo);

export default authRoutes;
