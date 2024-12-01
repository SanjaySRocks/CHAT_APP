import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import { addProfileImage } from "./controllers/AuthController.js";
import multer from "multer";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import http from "http"; // Import the http module to create a server
import messagesRoutes from "./routes/MessagesRoutes.js"; // Corrected path
dotenv.config();

const app = express();
const port = process.env.PORT || 8747; 
const databaseURL = process.env.DATABASE_URL;

// Set up multer for handling profile image uploads
const upload = multer({ dest: "uploads/profiles" });

// Configure CORS to allow cross-origin requests
app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));
 
// Serve static files from the uploads directory
app.use("/uploads/profiles", express.static("uploads/profiles"));

// Add profile image upload route
app.use("/api/auth/add-profile-image", upload.single("profile-image"), addProfileImage);

// Middleware for parsing cookies and JSON requests
app.use(cookieParser());
app.use(express.json());

// Set up routes for authentication, contacts, and messages
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes); // Corrected 'app.use'

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Set up Socket.IO on the HTTP server
setupSocket(server);

// Connect to the MongoDB database
mongoose.connect(databaseURL)
  .then(() => console.log("DB Connection Successful"))
  .catch(err => console.error("DB Connection Error:", err));
