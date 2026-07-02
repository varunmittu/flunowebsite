import { Schema, model, models } from "mongoose";

const LoginAttemptSchema = new Schema({
  ip:      { type: String, required: true, unique: true },
  count:   { type: Number, default: 0 },
  firstAt: { type: Date, default: Date.now },
});

export const LoginAttempt = models.LoginAttempt || model("LoginAttempt", LoginAttemptSchema);
