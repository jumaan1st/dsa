import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: String,
    difficulty: String,
    url: String,
    status: {
        type: Map,
        of: String, // status per user
        default: {}
    }
});

export default mongoose.model("Question", questionSchema);
