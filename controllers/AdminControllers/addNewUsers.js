import { User } from "../../models/User.js";
import { SystemAdmin } from "../../models/SystemAdmin.js";
import { NormalUser } from "../../models/NormalUser.js";
import { StoreOwner } from "../../models/StoreOwner.js";
import bcrypt from "bcrypt";

export const addUser = async (req, res) => {
  try {
    const { name, email, address, role, storeName, storeLocation, password } = req.body;

    if (!["SystemAdmin", "NormalUser", "StoreOwner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const finalPassword = password || "Kartikey@4321";
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const newUser = new User({
      name,
      email,
      address,
      role,
      password: hashedPassword
    });
    await newUser.save();

    if (role === "SystemAdmin") {
      await new SystemAdmin({ userId: newUser._id }).save();
    } else if (role === "NormalUser") {
      await new NormalUser({ userId: newUser._id }).save();
    } else if (role === "StoreOwner") {
      if (!storeName || !storeLocation) {
        return res.status(400).json({ message: "Store name and location are required" });
      }
      await new StoreOwner({
        userId: newUser._id,
        storeName,
        storeLocation
      }).save();
    }

    res.status(201).json({
      message: "User added successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding user", error: err.message });
  }
};
