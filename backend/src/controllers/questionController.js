import Question from "../models/Question.js";

// List
export const getQuestions = async (req, res) => {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
};

// Create
export const addQuestion = async (req, res) => {
    const { question, difficulty, url, status = {}, notes = {} } = req.body;
    const created = await Question.create({ question, difficulty, url, status, notes });
    res.status(201).json(created);
};

// Update (all fields)
export const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
};

// Delete
export const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ message: "Question deleted" });
};

// Update status for a user
export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { user, status } = req.body; // "Not Started" | "In Progress" | "Completed"
    const q = await Question.findById(id);
    if (!q) return res.status(404).json({ error: "Not found" });
    q.status.set(user, status);
    await q.save();
    res.json(q);
};

// Update note for a user
export const updateNote = async (req, res) => {
    const { id } = req.params;
    const { user, note } = req.body; // string
    const q = await Question.findById(id);
    if (!q) return res.status(404).json({ error: "Not found" });
    q.notes.set(user, note ?? "");
    await q.save();
    res.json(q);
};
