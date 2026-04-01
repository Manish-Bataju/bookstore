import jwt from "jsonwebtoken";
import User from "../schema/userModel.js";

//1. we have to check if the user is logged in and has a valid token
const protect = async (req, res, next) => {
  let token;

  //check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from "bearer token"
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //attach user data to the request object
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not Authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

//check if the logged in user is an admin or not
const admin = (req, res, next) => {
    // 1. Safely define the variable first
    const userRole = req.user && req.user.role ? String(req.user.role).trim().toLowerCase() : null;

    // 2. Perform the check
    if (userRole === 'admin') {
        return next(); // Stop here and go to the updateBook controller
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied: Admins Only",
            receivedRole: userRole
        });
    }
};

export { protect, admin };
