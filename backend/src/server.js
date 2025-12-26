import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

import { connectDb } from "./utils/connectDb.js";
import { notFound, errorHandler } from "./utils/errors.js";

import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import mapRoutes from "./routes/map.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import subscriberRoutes from "./routes/subscriber.routes.js";
import statsRoutes from "./routes/stats.routes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);

await connectDb();
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
