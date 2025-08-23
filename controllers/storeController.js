import express from 'express';
import { StoreOwner } from '../models/StoreOwner.js';
import { User } from '../models/User.js';

export const createStore = async (req, res) => {
  try {
    const { storeName, storeLocation } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.role !== 'StoreOwner') {
      return res
        .status(403)
        .json({ message: "Access denied. Only store owners can manage stores." });
    }

    const store = await StoreOwner.findOneAndUpdate(
      { userId },
      { storeName, storeLocation }, 
      { new: true, upsert: true, setDefaultsOnInsert: true } 
    );

    res.status(201).json({
      message: "Store created/updated successfully",
      store,
    });
  } catch (error) {
    console.error("Store creation/update error:", error);
    res.status(500).json({
      message: "Store creation/update failed",
      error: error.message,
    });
  }
};