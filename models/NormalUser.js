import mongoose from "mongoose";

const normalUserSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 
    },
    phone: { type: String },
});

export const NormalUser = mongoose.model("NormalUser", normalUserSchema);
