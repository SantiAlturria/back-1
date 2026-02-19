import { Router } from "express";
import passport from "passport";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/admin-only",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["admin", "premium"]),
  (req, res) => {
    res.json({ message: "Acceso permitido" });
  }
);

export default router;