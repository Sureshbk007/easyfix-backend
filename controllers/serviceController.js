import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import ServiceHistory from "../models/serviceHistoryModel.js";

// @desc Create a new service
// @route POST /api/services
// @access Private/ServiceProvider
export const createService = asyncHandler(async (req, res) => {
  const { name, category, description, location, keywords } = req.body;

  if (!name || !category) {
    res.status(400);
    throw new Error("Name and category are required");
  }

  const service = await Service.create({
    name,
    category,
    description,
    location,
    keywords,
    serviceProvider: req.user._id,
  });

  if (service) {
    // Update the service provider's services array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { services: service._id } },
      { new: true }
    );
  }

  res.status(201).json(service);
});

// @desc Record a completed service and payment in history
// @route POST /api/service-history
// @access Private
export const addServiceHistory = asyncHandler(async (req, res) => {
  const { serviceId, serviceProviderId, feedback, paymentMethod } = req.body;

  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  const serviceHistory = await ServiceHistory.create({
    service: serviceId,
    user: req.user._id,
    serviceProvider: serviceProviderId,
    feedback,
    price: service.price, // Automatically use the price from the service
    paymentMethod,
  });

  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { serviceHistory: serviceHistory._id } },
    { new: true }
  );

  await User.findByIdAndUpdate(
    serviceProviderId,
    { $push: { serviceHistory: serviceHistory._id } },
    { new: true }
  );

  res.status(201).json(serviceHistory);
});
