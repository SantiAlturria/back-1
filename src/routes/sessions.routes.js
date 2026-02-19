import { Router } from "express";
import passport from "passport";
import { loginUser } from "../controllers/sessions.controller.js";

const router = Router();

router.post("/login", loginUser);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { password, ...userWithoutPassword } = req.user.toObject();
    res.json(userWithoutPassword);
  },
);

export default router;
