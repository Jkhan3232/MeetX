// routes/activityRoutes.js
import express from "express";
import {
  listActivities,
  createActivity,
} from "../controller/activityController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/activity-list", listActivities);
router.post("/create-activity", isAuthenticated, createActivity); // Only logged-in users can create

export default router;
