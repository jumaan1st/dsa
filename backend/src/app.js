import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/questions.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);

export default app;
