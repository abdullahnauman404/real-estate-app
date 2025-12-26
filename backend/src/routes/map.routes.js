import express from "express";
import { body, validationResult } from "express-validator";
import PdfMap from "../models/PdfMap.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { parseListQuery, buildSort } from "../utils/crud.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { page, limit, q, sort, status } = parseListQuery(req);
    const filter = {};
    if (status) filter.status = status;
    const query = q ? { $or: [{ title: new RegExp(q, "i") }, { description: new RegExp(q, "i") }] , ...[filter] } : filter;

    const total = await PdfMap.countDocuments(query);
    const items = await PdfMap.find(query).sort(buildSort(sort)).skip((page-1)*limit).limit(limit);
    res.json({ items, page, limit, total, hasMore: page*limit < total });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  requireAuth,
  upload.fields([{ name: "pdf", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  body("title").isString().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const pdfFile = req.files?.pdf?.[0];
      const coverFile = req.files?.cover?.[0];

      const pdfUrl = pdfFile ? `/uploads/${pdfFile.filename}` : (req.body.pdfUrl || "");
      if (!pdfUrl) return res.status(400).json({ message: "pdfUrl or pdf file is required" });

      const doc = await PdfMap.create({
        ...req.body,
        pdfUrl,
        image: coverFile ? `/uploads/${coverFile.filename}` : (req.body.image || ""),
        tags: normalizeTags(req.body.tags),
      });

      res.status(201).json(doc);
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/:id",
  requireAuth,
  upload.fields([{ name: "pdf", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  async (req, res, next) => {
    try {
      const existing = await PdfMap.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Map not found" });

      const pdfFile = req.files?.pdf?.[0];
      const coverFile = req.files?.cover?.[0];

      const payload = { ...req.body };
      if (pdfFile) payload.pdfUrl = `/uploads/${pdfFile.filename}`;
      if (coverFile) payload.image = `/uploads/${coverFile.filename}`;
      if (payload.tags) payload.tags = normalizeTags(payload.tags);

      const updated = await PdfMap.findByIdAndUpdate(req.params.id, payload, { new: true });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await PdfMap.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Map not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

function normalizeTags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((t)=>String(t).toLowerCase().trim()).filter(Boolean);
  const str = String(input);
  try {
    const arr = JSON.parse(str);
    if (Array.isArray(arr)) return arr.map((t)=>String(t).toLowerCase().trim()).filter(Boolean);
  } catch {}
  return str.split(",").map((t)=>t.toLowerCase().trim()).filter(Boolean);
}

export default router;
