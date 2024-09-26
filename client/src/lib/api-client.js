import axios from "axios";
import { HOST } from "@/utils/constants"; // Make sure constants.js exists and exports HOST

export const apiClient = axios.create({
  baseURL: HOST,
});
