import express from "express";
import {
    getQuestions, addQuestion, updateQuestion, deleteQuestion,
    updateStatus, updateNote
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/", addQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

router.patch("/:id/status", updateStatus);
router.patch("/:id/note", updateNote);

export default router;
