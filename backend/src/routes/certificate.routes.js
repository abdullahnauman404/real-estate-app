import express from "express";
import { body, validationResult } from "express-validator";
import Certificate from "../models/Certificate.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const filter = q ? { $or: [{ title: new RegExp(q, "i") }, { issuer: new RegExp(q, "i") }] } : {};
    const items = await Certificate.find(filter).sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  body("title").isString().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const file = req.file;
      const imageUrl = file ? file.path : (req.body.imageUrl || "");
      if (!imageUrl) return res.status(400).json({ message: "imageUrl or image file is required" });

      const doc = await Certificate.create({ ...req.body, imageUrl });
      res.status(201).json(doc);
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/:id",
  requireAuth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const existing = await Certificate.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Certificate not found" });

      const payload = { ...req.body };
      if (req.file) payload.imageUrl = req.file.path;

      const updated = await Certificate.findByIdAndUpdate(req.params.id, payload, { new: true });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Certificate not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
