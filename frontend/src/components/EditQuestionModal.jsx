import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { DIFFICULTY } from "../constants/status";

export default function EditQuestionModal({ open, onClose, initial, onSaved }) {
    const [form, setForm] = useState({ question: "", difficulty: "Easy", url: "" });

    useEffect(() => {
        setForm(initial
            ? { question: initial.question, difficulty: initial.difficulty, url: initial.url }
            : { question: "", difficulty: "Easy", url: "" }
        );
    }, [initial]);

    const save = async () => {
        const method = initial ? "PUT" : "POST";
        const url = initial
            ? `http://localhost:8080/questions/${initial._id}`
            : "http://localhost:8080/questions";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        onSaved();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initial ? "Edit Question" : "Add Question"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField label="Title" value={form.question}
                               onChange={(e) => setForm(v => ({ ...v, question: e.target.value }))} fullWidth />
                    <TextField label="Difficulty" select value={form.difficulty}
                               onChange={(e) => setForm(v => ({ ...v, difficulty: e.target.value }))}>
                        {DIFFICULTY.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </TextField>
                    <TextField label="URL" value={form.url}
                               onChange={(e) => setForm(v => ({ ...v, url: e.target.value }))} fullWidth />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={save}>{initial ? "Save" : "Create"}</Button>
            </DialogActions>
        </Dialog>
    );
}
