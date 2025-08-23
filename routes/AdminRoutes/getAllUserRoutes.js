import express from "express";
import { getAllUsers } from "../../controllers/AdminControllers/getAllUsers.js";

const router = express.Router();
router.get("/get-all-users", getAllUsers);

export default router;