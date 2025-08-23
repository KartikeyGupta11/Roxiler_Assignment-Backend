import express from "express";
import { addUser } from "../../controllers/AdminControllers/addNewUsers.js";

const router = express.Router();
router.post("/add-user", addUser);

export default router;