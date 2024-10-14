// In usermodel.js
import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password has changed
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

// Prevent overwriting the User model if it already exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
