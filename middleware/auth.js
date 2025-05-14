import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json(new ApiError(401, "Authentication failed. Please login."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json(new ApiError(404, "Authentication failed. User not found."));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error. Please try again."));
  }
};
