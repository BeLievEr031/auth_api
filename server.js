import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectionDB.js";
import userRouter from "./Routes/userRouter.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware to Allow To use the JSON data.
app.use(express.json())

// MongoDB connection.
connectDB(DATABASE_URL);

// User Routes.
app.use("/api/auth",userRouter)

// Server SetUp.
app.listen(PORT,()=>{
    console.log(`Connected to ${PORT}`);
});