import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code:      { type: String, required: true, unique: true, uppercase: true },
    type:      { type: String, enum: ["percent", "fixed"], required: true },
    value:     { type: Number, required: true },
    minOrder:  { type: Number, default: 0     },
    maxUses:   { type: Number, default: 0     }, // 0 = unlimited
    usedCount: { type: Number, default: 0     },
    active:    { type: Boolean, default: true },
    expiresAt: { type: Date,   default: null  },
  },
  { timestamps: true }
);

export const CouponModel = models.Coupon || model("Coupon", CouponSchema);
