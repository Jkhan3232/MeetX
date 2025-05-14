import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
  bookedAt: { type: Date, default: Date.now },
});
export const Booking = mongoose.model("Booking", bookingSchema);
