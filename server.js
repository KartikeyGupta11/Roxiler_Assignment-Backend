import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv/config";

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})