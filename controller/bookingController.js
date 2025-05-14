import { Booking } from "../models/boking.model.js";
import { Activity } from "../models/active.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const bookActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json(new ApiError(404, "Activity not found"));
    }

    const booking = await Booking.create({
      user: userId,
      activity: activityId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, booking, "Activity booked successfully"));
  } catch (error) {
    console.error("Book Activity Error:", error);
    return res.status(500).json(new ApiError(500, "Failed to book activity"));
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId }).populate("activity");

    return res
      .status(200)
      .json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
  } catch (error) {
    console.log("Get Bookings Error:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch bookings"));
  }
};
