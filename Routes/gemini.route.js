import express from "express";
import {
  deleteChat,
  getHistory,
  sendPrompt,
  test,
} from "../Controllers/gemini.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";
import { verifyTokenConditional } from "../Middleware/verifyTokenConditional.js";
const router = express.Router();
router.get("/test", test);
router.post("/sendPrompt", verifyTokenConditional, sendPrompt);
router.post("/getHistory", verifyTokenConditional, getHistory);
router.post("/delete-chat", verifyToken, deleteChat); //only for logged in users

export default router;
