import mongoose, { Schema } from "mongoose";

const ConfigSchema = new Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const ConfigModel =
  (mongoose.models.Config as mongoose.Model<mongoose.InferSchemaType<typeof ConfigSchema>>) ||
  mongoose.model("Config", ConfigSchema);
