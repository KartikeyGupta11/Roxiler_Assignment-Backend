import express from "express";
import {
  submitRating,
  getStoreRatings,
  getUserRating,
} from "../controllers/ratingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/rate", protect, submitRating); 
router.get("/store/:storeId", getStoreRatings); 
router.get("/store/:storeId/user", protect, getUserRating); 

export default router;
