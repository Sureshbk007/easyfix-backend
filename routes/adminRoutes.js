import express from "express";
import {
  getAllUsers,
  getServiceProviders,
  createAdmin,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// @desc Create a new admin
// @route POST /api/admin/create
// @access Private/Admin
router.post("/create", protect, adminMiddleware, createAdmin);

// @desc Get all users
// @route GET /api/admin/users
// @access Private/Admin
router.get("/users", protect, adminMiddleware, getAllUsers);

// @desc Get all service providers
// @route GET /api/admin/service-providers
// @access Private/Admin
router.get("/service-providers", protect, adminMiddleware, getServiceProviders);

export default router;
