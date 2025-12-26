import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, lowercase: true },
    type: { type: String, required: true, trim: true, lowercase: true }, // villa, apartment, house, plot, commercial
    purpose: { type: String, required: true, enum: ["sale", "rent"], default: "sale" },
    price: { type: Number, required: true, min: 0 },
    area: { type: Number, default: 0, min: 0 },
    areaUnit: { type: String, default: "sq.ft" },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    description: { type: String, required: true },
    contactPhone: { type: String, default: "" },
    status: { type: String, enum: ["active", "sold", "rented", "inactive"], default: "active" },
    images: [{ type: String }], // URLs like /uploads/...
  },
  { timestamps: true }
);

PropertySchema.index({ title: "text", location: "text", description: "text" });

export default mongoose.model("Property", PropertySchema);
