import { CouponModel } from "@/lib/models/Coupon";

export interface CouponCheck {
  valid: boolean;
  error?: string;
  code?: string;
  type?: "percent" | "fixed";
  value?: number;
  discount?: number;
}

// Assumes an active DB connection (call connectDB first)
export async function checkCoupon(code: string, subtotal: number): Promise<CouponCheck> {
  const coupon = await CouponModel.findOne({ code: code.toUpperCase().trim(), active: true });
  if (!coupon) return { valid: false, error: "Invalid coupon code." };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: "This coupon has expired." };
  }
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: "This coupon has reached its usage limit." };
  }
  if (subtotal < (coupon.minOrder ?? 0)) {
    return { valid: false, error: `This coupon requires a minimum order of ₹${coupon.minOrder}.` };
  }

  const discount = coupon.type === "percent"
    ? Math.round((subtotal * coupon.value) / 100)
    : Math.min(coupon.value, subtotal);

  return { valid: true, code: coupon.code, type: coupon.type, value: coupon.value, discount };
}
