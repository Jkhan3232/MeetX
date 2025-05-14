// controllers/activityController.js
import { Activity } from "../models/active.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const listActivities = async (req, res) => {
  try {
    const activities = await Activity.find({});
    return res
      .status(200)
      .json(
        new ApiResponse(200, activities, "Activities fetched successfully")
      );
  } catch (error) {
    console.error("List Activities Error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch activities"));
  }
};

export const createActivity = async (req, res) => {
  try {
    const { title, description, location, dateTime } = req.body;

    const newActivity = await Activity.create({
      title,
      description,
      location,
      dateTime,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newActivity, "Activity created successfully"));
  } catch (error) {
    console.error("Create Activity Error:", error);
    return res.status(500).json(new ApiError(500, "Failed to create activity"));
  }
};
