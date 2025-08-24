import mongoose from "mongoose";
import { Rating } from "../models/StoreRating.js";
import { StoreOwner } from "../models/StoreOwner.js";
import { RatingCounter } from "../models/RatingCounter.js";

async function updateStoreAverageRating(storeId) {
  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    console.error("Invalid storeId passed to updateStoreAverageRating:", storeId);
    return;
  }

  const avg = await Rating.aggregate([
    { $match: { storeId: new mongoose.Types.ObjectId(storeId) } },
    { $group: { _id: "$storeId", averageRating: { $avg: "$rating" } } },
  ]);

  const average = avg.length > 0 ? avg[0].averageRating : 0;

  await StoreOwner.findByIdAndUpdate(storeId, { storeRating: average });
}

export const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });
    if (!storeId || rating === undefined) return res.status(400).json({ message: "Store ID and rating are required." });
    if (!mongoose.Types.ObjectId.isValid(storeId)) return res.status(400).json({ message: "Invalid Store ID format." });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be between 1 and 5." });

    const existingRating = await Rating.findOne({ storeId, userId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await Rating.create({ storeId, userId, rating });
    }

    await RatingCounter.findOneAndUpdate(
      {}, 
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    await updateStoreAverageRating(storeId);

    return res.status(200).json({ message: "Rating submitted successfully." });
  } catch (error) {
    console.error("Error in submitRating:", error);
    return res.status(500).json({ message: "Error while rating", error: error.message });
  }
};

export const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json({ message: "Invalid Store ID format." });
    }

    const ratings = await Rating.find({ storeId })
      .populate("userId", "name email")
      .lean();

    return res.status(200).json({ ratings });
  } catch (error) {
    console.error("Error in getStoreRatings:", error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json({ message: "Invalid Store ID format." });
    }

    const rating = await Rating.findOne({ storeId, userId }).lean();

    return res.status(200).json({ rating });
  } catch (error) {
    console.error("Error in getUserRating:", error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};
