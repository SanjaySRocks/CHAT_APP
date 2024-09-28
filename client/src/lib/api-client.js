import axios from "axios";
import { HOST } from "@/utils/constants"; // Ensure the path is correct

export const apiClient = axios.create({
  baseURL: HOST, // This will use the HOST defined in constants.js
});
