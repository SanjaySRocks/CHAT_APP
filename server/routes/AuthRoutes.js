import { Router } from "express";
import { login, signup, getUserInfo, userProfile, addProfileImage, removeProfileImage } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
const authRoutes = Router();
const upload = multer({ dest : "uploads/profiles/" });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, '..', 'uploads', 'profiles');
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
    
//     const fileName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, fileName);
//   }
// });




// Define routes
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, userProfile);

// Use multer for file upload with the add-profile-image route
authRoutes.post("/add-profile-image", verifyToken,  upload.single("profile-image"),   addProfileImage);

authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);

export default authRoutes;
