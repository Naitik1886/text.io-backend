const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");

async function protectedRoute(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "You are not authenticated" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
   
    return res.status(500).json({ error: "An error occurred while authenticating" });
  }
}

module.exports = protectedRoute;