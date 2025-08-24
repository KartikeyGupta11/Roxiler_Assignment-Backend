import { Rating } from "../../models/StoreRating.js";
import { User } from "../../models/User.js";
import { StoreOwner } from "../../models/StoreOwner.js";

export const getRatingsForStoreOwner = async (req, res) => {
  try {
    // Step 1: Find the store owner's document
    const storeOwner = await StoreOwner.findOne({ userId: req.user._id });
    if (!storeOwner) {
      return res.status(404).json({ message: "Store owner not found" });
    }

    // Step 2: Fetch ratings for this store
    const ratings = await Rating.aggregate([
      {
        $match: { storeId: storeOwner._id }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          rating: 1,
          userName: "$user.name",
          userEmail: "$user.email"
        }
      }
    ]);

    // Step 3: Calculate average rating
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
        : 0;

    res.status(200).json({ ratings, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch store ratings" });
  }
};
