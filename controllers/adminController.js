import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// @desc Create a new admin (admin only)
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can create new admins" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
});

// @desc Get all users
// @route GET /api/admin/users
// @access Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  // Fetch all users from the database
  const users = await User.find({ role: "user" }).select("-password"); // Exclude the password field for security
  res.json(users);
});

// @desc Get all service providers
// @route GET /api/admin/service-providers
// @access Private/Admin
export const getServiceProviders = asyncHandler(async (req, res) => {
  // Fetch all service providers from the database
  const serviceProviders = await User.find({ role: "serviceProvider" }).select(
    "-password"
  ); // Exclude the password field
  res.json(serviceProviders);
});
