import mongoose, { Schema } from "mongoose";

const PushSubSchema = new Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth:   { type: String, required: true },
  },
  userEmail: { type: String, default: "" }, // linked customer email (if logged in when subscribing)
  createdAt: { type: Date, default: Date.now },
});

export const PushSub =
  mongoose.models.PushSub || mongoose.model("PushSub", PushSubSchema);
