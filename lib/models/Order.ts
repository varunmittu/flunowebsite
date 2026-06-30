import mongoose, { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema({
  productId: String,
  name: String,
  size: String,
  price: Number,
  quantity: Number,
  image: String,
});

const AddressSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
});

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, default: null },
    items: [OrderItemSchema],
    address: AddressSchema,
    subtotal: Number,
    shipping: Number,
    total: Number,
    coupon: { type: String, default: null },
    discount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    paymentId: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
