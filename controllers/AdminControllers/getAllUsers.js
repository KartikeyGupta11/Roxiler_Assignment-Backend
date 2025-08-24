import { User } from "../../models/User.js";
import { StoreOwner } from "../../models/StoreOwner.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();

    const normalUsers = [];
    const systemAdmins = [];
    const storeOwners = [];

    for (const user of users) {
      if (user.role === "NormalUser") {
        normalUsers.push(user);
      } else if (user.role === "SystemAdmin") {
        systemAdmins.push(user);
      } else if (user.role === "StoreOwner") {
        const storeOwnerDoc = await StoreOwner.findOne({ userId: user._id }).lean();
        storeOwners.push({
          ...user,
          storeName: storeOwnerDoc?.storeName || "",
          storeLocation: storeOwnerDoc?.storeLocation || "",
          storeRating: storeOwnerDoc?.storeRating || 0
        });
      }
    }

    res.status(200).json({
      normalUsers,
      systemAdmins,
      storeOwners
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};
