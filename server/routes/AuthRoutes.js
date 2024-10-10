import { Router } from "express";
import { login, signup, getUserInfo, userProfile, addProfileImage, removeProfileImage  , logout} from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
const authRoutes = Router();
const upload = multer({ dest : "uploads/profiles/" });

// Define routes
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, userProfile);

// Use multer for file upload with the add-profile-image route
authRoutes.post("/add-profile-image", verifyToken,  upload.single("profile-image"),   addProfileImage);

authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout" , logout);
export default authRoutes;
