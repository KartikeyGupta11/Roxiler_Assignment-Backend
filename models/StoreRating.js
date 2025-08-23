import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreOwner",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

ratingSchema.index({ storeId: 1, userId: 1 }, { unique: true });

export const Rating = mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
