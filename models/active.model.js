import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
  title: String,
  description: String,
  location: String,
  dateTime: Date,
});
export const Activity = mongoose.model("Activity", activitySchema);
