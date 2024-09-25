import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;
//cors -> agr hm differnt server use kre we need to commncate btw them
app.use(cors({
origin:[process.env.ORIGIN], // from where reqst is made alg frntend use hoge to do url use hoge
methods:["GET" ,"POST" , "PUT" , "PATCH" , "DELETE"],
credentials:true,//enables cookies k lie crdntn v true hona chhaiye
}));


app.use(cookieParser()) //getting cookie from frontend
app.use(express.json()) //payload reqst sbko json frmt m krdegi

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});

mongoose.connect(databaseURL)
  .then(() => console.log("DB Connection Successful"))
  .catch(err => console.error("DB Connection Error:", err));
 