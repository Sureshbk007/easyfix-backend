import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  keywords: [{ type: String }],
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
