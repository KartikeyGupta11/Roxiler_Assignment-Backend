import { User } from "../../models/User.js";
import { StoreOwner } from "../../models/StoreOwner.js";

// Get filtered stores and owners
export const getStoresList = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (address) filter.address = { $regex: address, $options: "i" };
    if (role) filter.role = role;

    const users = await User.find(filter).select("name email address role");
    const storeOwners = await StoreOwner.find()
      .populate("userId", "name email address role")
      .select("storeName storeRating storeLocation userId");

    // Combine: Only include owners whose user matches the filter
    const filteredStores = storeOwners.filter((s) =>
      users.some((u) => u._id.toString() === s.userId._id.toString())
    );

    res.status(200).json(filteredStores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores", error: err });
  }
};

// Add a new store + owner details
export const addStore = async (req, res) => {
  try {
    const { name, email, address, contactNumber, storeName, storeLocation } =
      req.body;

    // Create User first
    const newUser = new User({
      name,
      email,
      address,
      contactNumber,
      role: "StoreOwner",
    });
    await newUser.save();

    // Create StoreOwner record
    const newStore = new StoreOwner({
      userId: newUser._id,
      storeName,
      storeLocation,
    });
    await newStore.save();

    res.status(201).json({ message: "Store and owner added successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error adding store", error: err });
  }
};
