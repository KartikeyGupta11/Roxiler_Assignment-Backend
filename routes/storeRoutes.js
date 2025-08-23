import express from 'express';
import { createStore } from '../controllers/storeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-store', protect ,createStore);

export default router;
