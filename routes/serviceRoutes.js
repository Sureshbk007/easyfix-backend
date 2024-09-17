import express from "express";
import { createService } from "../controllers/serviceController.js";
import { protect, isServiceProvider } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new service
router.post("/", protect, isServiceProvider, createService);

export default router;
