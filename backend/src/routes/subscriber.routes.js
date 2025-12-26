import express from "express";
import { body, validationResult } from "express-validator";
import Subscriber from "../models/Subscriber.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  body("email").isEmail().normalizeEmail(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const email = req.body.email;
      const existing = await Subscriber.findOne({ email });
      if (existing) return res.json({ ok: true, message: "Already subscribed" });

      await Subscriber.create({ email });
      res.status(201).json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await Subscriber.find({}).sort({ createdAt: -1 }).limit(1000);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await Subscriber.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subscriber not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
