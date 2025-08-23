import express from "express";
import { storeFilter } from "../../controllers/NormalUserController/storeFiltering.js";

const router = express.Router();
router.get("/filter-stores", storeFilter);

export default router;