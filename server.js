import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv/config";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otpVerificationRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import statsRoutes from "./routes/AdminRoutes/statsRoutes.js";
import addNewUsersRoutes from "./routes/AdminRoutes/addNewUsersRoutes.js";
import getAllUsersRoutes from "./routes/AdminRoutes/getAllUserRoutes.js";
import storeManagerRoutes from "./routes/AdminRoutes/storeManagerRoutes.js";

const app = express();
connectDB();

// app.use(cors())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/store", storeRoutes);

//Admin routes
app.use("/api/admin/stats",statsRoutes);
app.use("/api/admin",addNewUsersRoutes);
app.use("/api/admin",getAllUsersRoutes);
app.use("/api/admin/store-manager",storeManagerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})