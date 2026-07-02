import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  sender:    { type: String, enum: ["customer", "admin"], required: true },
  text:      { type: String, default: "" },
  image:     { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const TicketSchema = new Schema(
  {
    ticketId:  { type: String, required: true, unique: true },
    name:      { type: String, required: true },
    email:     { type: String, required: true },
    phone:     String,
    subject:   { type: String, required: true },
    message:   { type: String, required: true },
    category:  { type: String, enum: ["order", "product", "payment", "return", "other"], default: "other" },
    status:    { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    priority:  { type: String, enum: ["low", "medium", "high"], default: "medium" },
    adminNote: String,
    messages:  [MessageSchema],
  },
  { timestamps: true }
);

export const Ticket = models.Ticket || model("Ticket", TicketSchema);
