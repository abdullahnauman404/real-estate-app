import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, default: "", trim: true },
    issueDate: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, required: true }, // image file or external
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", CertificateSchema);
