import { User } from "../../models/User.js";
import { StoreOwner } from "../../models/StoreOwner.js";

export const storeFilter = async (req, res) => {
  try {
    const { storeName, storeLocation } = req.query;

    let filter = {};
    if (storeName) filter.storeName = { $regex: storeName, $options: "i" };
    if (storeLocation) filter.storeLocation = { $regex: storeLocation, $options: "i" };

    const stores = await StoreOwner.find(filter)
      .populate("userId", "name email address role")
      .select("storeName storeRating storeLocation userId");

    res.status(200).json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores", error: err });
  }
};
