import express from "express";
import { body, validationResult } from "express-validator";
import Property from "../models/Property.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { parseListQuery, buildSort } from "../utils/crud.js";

const router = express.Router();

// Public list with filters/search/sort/pagination
router.get("/", async (req, res, next) => {
  try {
    const { page, limit, q, sort, city, type, purpose, status } = parseListQuery(req);

    const filter = {};
    if (city) filter.city = city;
    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (status) filter.status = status;

    const query = q ? { $text: { $search: q }, ...filter } : filter;
    const total = await Property.countDocuments(query);
    const items = await Property.find(query)
      .sort(buildSort(sort))
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ items, page, limit, total, hasMore: page * limit < total });
  } catch (e) {
    next(e);
  }
});

// Public get by id
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Property.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Property not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

// Admin create
router.post(
  "/",
  requireAuth,
  upload.array("images", 12),
  body("title").isString().trim().notEmpty(),
  body("location").isString().trim().notEmpty(),
  body("city").isString().trim().notEmpty(),
  body("type").isString().trim().notEmpty(),
  body("purpose").isIn(["sale", "rent"]).optional(),
  body("price").isFloat({ min: 0 }),
  body("description").isString().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const images = (req.files || []).map((f) => f.path);
      const doc = await Property.create({
        ...req.body,
        city: req.body.city.toLowerCase(),
        type: req.body.type.toLowerCase(),
        images,
      });

      res.status(201).json(doc);
    } catch (e) {
      next(e);
    }
  }
);

// Admin update
router.put(
  "/:id",
  requireAuth,
  upload.array("images", 12),
  async (req, res, next) => {
    try {
      const existing = await Property.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Property not found" });

      const newImages = (req.files || []).map((f) => f.path);
      const keepImages = (() => {
        const raw = req.body.keepImages;
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        try { return JSON.parse(raw); } catch { return []; }
      })();

      const payload = { ...req.body };
      if (payload.city) payload.city = payload.city.toLowerCase();
      if (payload.type) payload.type = payload.type.toLowerCase();

      const updated = await Property.findByIdAndUpdate(
        req.params.id,
        { $set: payload, images: [...keepImages, ...newImages] },
        { new: true }
      );

      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

// Admin delete
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Property not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
