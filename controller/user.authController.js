import { asyncHandler } from "../utils/AsyncHendaler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const register = asyncHandler(async (req, res) => {
  try {
    const { email, name, password, phone } = req.body;

    if ([email, name, password, phone].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required");
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      throw new ApiError(400, "Invalid phone number. It must be 10 digits");
    }

    // Check if user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    // Create a new user
    const user = await User.create({
      email,
      password,
      name: name,
      phone,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    console.error(error);
    // Use throw to propagate the error to the error handling middleware
    throw new ApiError(501, "Internal Server Error");
  }
});

// Login route
const login = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .json(
            new ApiError(401, info?.message || "Invalid email or password")
          );
      }

      const token = jwt.sign(
        { sub: user._id }, // payload
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
      });

      return res
        .status(200)
        .json(new ApiResponse(200, { token }, "Login successful"));
    }
  )(req, res, next);
};

// Get current logged-in user details
const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User details retrieved successfully"));
  } catch (error) {
    console.error("GetMe error:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

// Logout user by clearing the token cookie
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error during logout"));
  }
};

// Export endpoints
export { register, login, getMe, logout };
