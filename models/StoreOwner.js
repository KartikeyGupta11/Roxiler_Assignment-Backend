import mongoose from "mongoose";

const storeOwnerSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 
    },
    storeName: { type: String},
    storeRating: { type: Number, default: 0 },
    storeLocation: { type: String },
});

export const StoreOwner = mongoose.models.StoreOwner || mongoose.model("StoreOwner", storeOwnerSchema);

