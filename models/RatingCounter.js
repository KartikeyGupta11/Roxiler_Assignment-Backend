import mongoose from "mongoose";

const ratingCounterSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }
});

export const RatingCounter = mongoose.model("RatingCounter", ratingCounterSchema);
