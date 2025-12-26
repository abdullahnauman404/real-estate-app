import express from "express";
import { body, validationResult } from "express-validator";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Public create inquiry / quick inquiry / schedule viewing
router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  body("phone").isString().trim().notEmpty(),
  body("message").isString().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { propertyId } = req.body;
      let propertyTitle = req.body.propertyTitle || "";
      if (propertyId) {
        const p = await Property.findById(propertyId).select("title");
        if (p) propertyTitle = p.title;
      }

      const doc = await Inquiry.create({ ...req.body, propertyTitle });
      res.status(201).json(doc);
    } catch (e) {
      next(e);
    }
  }
);

// Admin list
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await Inquiry.find({}).sort({ createdAt: -1 }).limit(500);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// Admin update status
router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const status = (req.body.status || "").toString();
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Inquiry not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
