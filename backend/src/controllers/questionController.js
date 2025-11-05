import Question from "../models/Question.js";

export const getQuestions = async (req, res) => {
    const questions = await Question.find();
    res.json(questions);
};

export const addQuestion = async (req, res) => {
    const created = await Question.create(req.body);
    res.status(201).json(created);
};

export const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
};

export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { user, status } = req.body;

    const q = await Question.findById(id);
    q.status.set(user, status);
    await q.save();

    res.json(q);
};

export const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ message: "Question deleted" });
};
