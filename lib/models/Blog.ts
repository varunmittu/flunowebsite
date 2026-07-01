import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title:      { type: String, required: true },
    slug:       { type: String, required: true, unique: true },
    excerpt:    String,
    content:    String,
    coverImage: String,
    category:   String,
    author:     { type: String, default: "Fluno Team" },
    published:  { type: Boolean, default: false },
    readTime:   String,
    images:     [String],
    tags:       [String],
  },
  { timestamps: true }
);

export const BlogModel = models.Blog || model("Blog", BlogSchema);
