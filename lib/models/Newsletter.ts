import { Schema, model, models } from "mongoose";

const NewsletterSchema = new Schema(
  { email: { type: String, required: true, unique: true } },
  { timestamps: true }
);

export const Newsletter = models.Newsletter || model("Newsletter", NewsletterSchema);
