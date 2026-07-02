import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId:   { type: String, required: true },
    productSlug: { type: String, required: true },
    userId:      String,
    name:        { type: String, required: true },
    email:       { type: String, required: true },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    title:       String,
    comment:     { type: String, required: true },
    verified:    { type: Boolean, default: false },
    helpful:     { type: Number, default: 0 },
    ip:          { type: String, default: null },
  },
  { timestamps: true }
);

export const Review = models.Review || model("Review", ReviewSchema);
