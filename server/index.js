import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8747; // Changed the port to 8748
const databaseURL = process.env.DATABASE_URL;

// CORS configuration for different server communication
app.use(cors({
  origin: [process.env.ORIGIN], // From where requests are made, this will be the frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true, // Enables cookies
}));

app.use(cookieParser()); // Getting cookie from frontend
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use("/uploads/profiles", express.static("uploads/profiles")); // Route for authentication
app.use("/api/auth", authRoutes); 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Logs server running message
});

mongoose.connect(databaseURL)
  .then(() => console.log("DB Connection Successful"))
  .catch(err => console.error("DB Connection Error:", err));
