import express from "express";
import {
  login,
  checkAuth,
  log_out,
  google_callback,
} from "../Controllers/auth.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();
router.options("/auth/google/callback", (req, res) => {
  res.set(
    "Access-Control-Allow-Origin",
    "https://gemini-chat-theta-two.vercel.app"
  );  
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200); // Respond with 200 OK
});

router.get("/login", login);
router.post("/check-auth", verifyToken, checkAuth);
router.post("/log-out", log_out);
router.post("/auth/google/callback", google_callback);

export default router;
