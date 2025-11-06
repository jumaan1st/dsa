import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    url: { type: String, required: true, trim: true },
    status: { type: Map, of: String, default: {} },
    notes: { type: Map, of: String, default: {} },
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
