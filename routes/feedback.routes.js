import { Router } from "express";
import {
  createFeedback,
  getAllFeedback,
  getMyFeedbacks,
  updateFeedback,
  deleteFeedback
} from "../controllers/feedback.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = Router();

// User
router.post("/", protect, createFeedback);
router.get("/my", protect, getMyFeedbacks);
router.put("/:id", protect, updateFeedback);

// Admin
router.get("/", protect, adminOnly, getAllFeedback);
router.delete("/:id", protect, adminOnly, deleteFeedback);

export default router;
