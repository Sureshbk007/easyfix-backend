import express from "express";
import { getRecommendedServices } from "../controllers/recommendationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getRecommendedServices);

export default router;
