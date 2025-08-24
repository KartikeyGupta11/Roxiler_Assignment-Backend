import express from "express";
import { getRatingsForStoreOwner } from "../../controllers/StoreOwnerControllers/fetchRatingController.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-store-ratings", protect, getRatingsForStoreOwner);

export default router;
