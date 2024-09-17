import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "serviceProvider", "user"],
      default: "user",
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], //Specific to service providers
    serviceHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    preferences: {
      category: { type: String },
      location: { type: String },
    },
    businessName: { type: String }, // Specific to service providers
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
