import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import natural from "natural";
import cosineSimilarity from "cosine-similarity";

// Initialize TF-IDF
const tokenizer = new natural.WordTokenizer();
const tfidf = new natural.TfIdf();

// Helper function to calculate TF-IDF vectors and cosine similarity
const calculateSimilarities = (queryDescription, services) => {
  // Create TF-IDF matrix
  const descriptions = services.map((service) => service.description);
  tfidf.addDocument(queryDescription);
  descriptions.forEach((desc) => tfidf.addDocument(desc));

  const queryVector = tfidf.listTerms(0).map((term) => term.tfidf);
  const serviceVectors = descriptions.map((_, index) =>
    tfidf.listTerms(index + 1).map((term) => term.tfidf)
  );

  return serviceVectors.map((vector) => cosineSimilarity(queryVector, vector));
};

// @desc Get recommended services for a user
export const getRecommendedServices = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("serviceHistory");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Collect descriptions from the user's service history
  const serviceHistory = await Service.find({
    _id: { $in: user.serviceHistory },
  });

  if (serviceHistory.length === 0) {
    return res.status(404).json({ message: "No service history found" });
  }

  const descriptions = serviceHistory.map((service) => service.description);

  // Calculate TF-IDF vectors and cosine similarity
  const queryDescription = descriptions.join(" ");
  const allServices = await Service.find({
    _id: { $nin: user.serviceHistory.map((s) => s._id) },
  });

  const similarities = calculateSimilarities(queryDescription, allServices);

  // Get top N similar services
  const topServices = allServices
    .map((service, index) => ({ service, similarity: similarities[index] }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10) // Top 10 similar services
    .map((item) => item.service);

  res.json(topServices);
});
