import { useEffect, useState } from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Container,
    Typography,
    Link,
    Paper,
    CircularProgress,
    Box,
} from "@mui/material";
import StatusSelect from "./StatusSelect";

export default function QuestionTable() {
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const usersRes = await fetch("http://localhost:8080/users");
        setUsers(await usersRes.json());

        const qRes = await fetch("http://localhost:8080/questions");
        setQuestions(await qRes.json());
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (qid, user, status) => {
        await fetch(`http://localhost:8080/questions/${qid}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, status }),
        });
        fetchData();
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                DSA Progress Tracker
            </Typography>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Question</b></TableCell>
                            <TableCell><b>Difficulty</b></TableCell>
                            {users.map((u) => (
                                <TableCell key={u._id} align="center">
                                    <b>{u.name.charAt(0).toUpperCase() + u.name.slice(1)}</b>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {questions.map((q) => (
                            <TableRow key={q._id}>
                                <TableCell>
                                    <Link href={q.url} target="_blank" underline="hover">
                                        {q.question}
                                    </Link>
                                </TableCell>
                                <TableCell>{q.difficulty}</TableCell>

                                {users.map((u) => (
                                    <TableCell key={u._id} align="center">
                                        <StatusSelect
                                            value={q.status?.[u.name]}
                                            onChange={(newVal) => updateStatus(q._id, u.name, newVal)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}
