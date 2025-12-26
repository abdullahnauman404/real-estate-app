import mongoose from "mongoose";

const PdfMapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "general", lowercase: true },
    tags: [{ type: String, lowercase: true }],
    image: { type: String, default: "" }, // cover image url
    pdfUrl: { type: String, required: true }, // file or external link
    size: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("PdfMap", PdfMapSchema);
