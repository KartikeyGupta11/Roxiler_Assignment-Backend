import express from "express";
import { countUsers, getUsersList } from "../../controllers/AdminControllers/countUsersControllers.js";

const router = express.Router();

router.get("/count-users",countUsers);
router.get("/get-users-list",getUsersList);

export default router;