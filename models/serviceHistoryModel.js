import mongoose from "mongoose";

const serviceHistorySchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    feedback: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      required: true,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceHistory = mongoose.model("ServiceHistory", serviceHistorySchema);

export default ServiceHistory;
