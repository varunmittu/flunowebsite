import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name:        { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    description: String,
    image:       String,
    order:       { type: Number, default: 0    },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = models.Category || model("Category", CategorySchema);
