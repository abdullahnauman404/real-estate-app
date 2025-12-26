import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: false },
    propertyTitle: { type: String, default: "" },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, enum: ["inquiry", "quick_inquiry", "schedule_viewing"], default: "inquiry" },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", InquirySchema);
