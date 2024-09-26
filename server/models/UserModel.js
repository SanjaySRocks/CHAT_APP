import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt"; // Import hash as well

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
  const salt = await genSalt(10); // You can specify the number of salt rounds
  this.password = await hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema); // Changed to singular 'User'

export default User;
