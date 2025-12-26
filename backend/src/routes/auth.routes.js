import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";

const router = express.Router();

/**
 * Admin login based on env credentials.
 * For production, move to a Users collection + password rotation policy.
 */
router.post(
  "/login",
  body("username").isString().trim().notEmpty(),
  body("password").isString().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { username, password } = req.body;
      const envUser = process.env.ADMIN_USERNAME || "admin";
      const envPass = process.env.ADMIN_PASSWORD || "admin123";

      // Compare safely (support both plain & bcrypt in env)
      const passOk =
        envPass.startsWith("$2") ? await bcrypt.compare(password, envPass) : password === envPass;

      if (username !== envUser || !passOk) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, user: { username, role: "admin" } });
    } catch (e) {
      return next(e);
    }
  }
);

export default router;
