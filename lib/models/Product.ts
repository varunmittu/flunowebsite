import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name:          { type: String, required: true },
    slug:          { type: String, required: true, unique: true },
    tagline:       String,
    description:   String,
    price:         { type: Number, required: true },
    originalPrice: Number,
    size:          String,
    category:      String,
    images:        [String],
    ingredients:   [String],
    howToUse:      [String],
    benefits:      [String],
    badges:        [String],
    inStock:       { type: Boolean, default: true  },
    featured:      { type: Boolean, default: false },
    newArrival:    { type: Boolean, default: false },
    active:        { type: Boolean, default: true  },
    rating:        { type: Number,  default: 0     },
    reviewCount:   { type: Number,  default: 0     },
  },
  { timestamps: true }
);

export const ProductModel = models.Product || model("Product", ProductSchema);
