// routes/bookingRoutes.js
import express from "express";
import {
  bookActivity,
  getMyBookings,
} from "../controller/bookingController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/:activityId", isAuthenticated, bookActivity);
router.get("/me", isAuthenticated, getMyBookings);

export default router;
