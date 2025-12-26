import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Property from "../models/Property.js";
import PdfMap from "../models/PdfMap.js";
import Certificate from "../models/Certificate.js";
import Inquiry from "../models/Inquiry.js";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const [properties, maps, certificates, inquiries, subscribers] = await Promise.all([
      Property.countDocuments({}),
      PdfMap.countDocuments({}),
      Certificate.countDocuments({}),
      Inquiry.countDocuments({}),
      Subscriber.countDocuments({}),
    ]);
    res.json({ properties, maps, certificates, inquiries, subscribers });
  } catch (e) {
    next(e);
  }
});

export default router;
