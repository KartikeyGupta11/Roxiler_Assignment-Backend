import mongoose from "mongoose";

const systemAdminSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 
    },  
});

export const SystemAdmin = mongoose.model("SystemAdmin", systemAdminSchema);
