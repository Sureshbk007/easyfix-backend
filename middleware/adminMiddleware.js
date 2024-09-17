const adminMiddleware = (req, res, next) => {
  // Check if user is logged in and has 'admin' role
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, proceed to the next middleware or route handler
  } else {
    res.status(403).json({ message: "Access denied, admin only" }); // Deny access if not an admin
  }
};

export { adminMiddleware };
