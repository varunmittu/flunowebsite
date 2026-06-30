import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    image: String,
    emailVerified: Date,
    role: { type: String, enum: ["customer", "admin", "staff"], default: "customer" },
    addresses: [
      {
        label: String,
        name: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
        isDefault: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
