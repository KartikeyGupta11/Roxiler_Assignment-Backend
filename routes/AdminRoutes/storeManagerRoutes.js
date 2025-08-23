import express from "express";
import { getStoresList, addStore } from "../../controllers/AdminControllers/storeManagerController.js";

const router = express.Router();

router.get("/get-stores-list", getStoresList);
router.post("/add-store", addStore);

export default router;
