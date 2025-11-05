import express from "express";
import { getQuestions, addQuestion, updateQuestion, updateStatus, deleteQuestion } from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/", addQuestion);
router.put("/:id", updateQuestion);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteQuestion);

export default router;
