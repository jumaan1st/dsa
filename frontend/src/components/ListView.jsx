import { useEffect, useState } from "react";
import {
    Paper, Table, TableHead, TableRow, TableCell, TableBody, Link,
    IconButton, Tooltip, MenuItem, TextField, Box, Stack, Chip
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import { STATUS } from "../constants/status";
import EditNoteModal from "./EditNoteModal";

export default function ListView() {
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [activeNote, setActiveNote] = useState({ open: false, qid: "", user: "", content: "" });
    const [refreshKey, setRefreshKey] = useState(0);

    const load = async () => {
        const ur = await fetch("http://localhost:8080/users"); setUsers(await ur.json());
        const qr = await fetch("http://localhost:8080/questions"); setQuestions(await qr.json());
    };
    useEffect(() => { load(); }, [refreshKey]);

    const changeStatus = async (qid, user, status) => {
        await fetch(`http://localhost:8080/questions/${qid}/status`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, status })
        });
        setRefreshKey(v => v + 1);
    };

    return (
        <>
            <Paper elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Difficulty</TableCell>
                            {users.map(u => (
                                <TableCell key={u._id} align="center" sx={{ textTransform: "capitalize" }}>
                                    {u.name}
                                </TableCell>
                            ))}
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map(q => (
                            <TableRow key={q._id}>
                                <TableCell>
                                    <Link href={q.url} target="_blank" underline="hover">{q.question}</Link>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={q.difficulty}
                                        color={q.difficulty === "Easy" ? "success" : q.difficulty === "Medium" ? "warning" : "error"}
                                        variant="outlined"
                                    />
                                </TableCell>

                                {users.map(u => (
                                    <TableCell key={u._id} align="center">
                                        <TextField
                                            select size="small"
                                            value={q.status?.[u.name] || "Not Started"}
                                            onChange={(e) => changeStatus(q._id, u.name, e.target.value)}
                                            sx={{ minWidth: 150 }}
                                        >
                                            {STATUS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                        </TextField>
                                    </TableCell>
                                ))}

                                <TableCell>
                                    <Tooltip title="Edit per-user note">
                                        <IconButton
                                            onClick={() =>
                                                setActiveNote({
                                                    open: true,
                                                    qid: q._id,
                                                    user: users[0]?.name || "", // default to first; you can extend to pick user if you want
                                                    content: ""
                                                })
                                            }
                                        >
                                            <NotesIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {activeNote.open && (
                <EditNoteModal
                    open={activeNote.open}
                    onClose={() => setActiveNote({ open: false })}
                    questionId={activeNote.qid}
                    activeUser={activeNote.user}
                    initialNote={
                        questions.find(x => x._id === activeNote.qid)?.notes?.[activeNote.user] || ""
                    }
                    onSaved={() => setRefreshKey(v => v + 1)}
                />
            )}
        </>
    );
}
