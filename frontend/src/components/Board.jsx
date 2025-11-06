import { useEffect, useMemo, useState } from "react";
import {
    Box, IconButton, Tooltip, ToggleButtonGroup, ToggleButton, Chip, Stack
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "./Column";
import EditQuestionModal from "./EditQuestionModal";
import UserManager from "./UserManager";
import { STATUS } from "../constants/status";

export default function Board() {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState("");
    const [questions, setQuestions] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchAll = async () => {
        const ur = await fetch("http://localhost:8080/users"); const u = await ur.json();
        setUsers(u);
        if (!activeUser && u.length) setActiveUser(u[0].name);
        const qr = await fetch("http://localhost:8080/questions"); const q = await qr.json();
        setQuestions(q);
    };

    useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [refreshKey]);

    const columns = useMemo(() => {
        const map = Object.fromEntries(STATUS.map(s => [s, []]));
        for (const q of questions) {
            const s = q?.status?.[activeUser] || "Not Started";
            map[s].push(q);
        }
        return map;
    }, [questions, activeUser]);

    const onDragEnd = async (event) => {
        const { active, over } = event;
        if (!active || !over) return;
        const questionId = active.id;
        const newStatus = over.id;
        if (!STATUS.includes(newStatus)) return;
        await fetch(`http://localhost:8080/questions/${questionId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: activeUser, status: newStatus })
        });
        setRefreshKey(v => v + 1);
    };

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <ToggleButtonGroup
                    exclusive size="small" value={activeUser}
                    onChange={(e, v) => v && setActiveUser(v)}
                >
                    {users.map(u => (
                        <ToggleButton key={u._id} value={u.name} sx={{ textTransform: "capitalize" }}>
                            {u.name}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Chip label={`Total: ${questions.length}`} size="small" />

                <Box flex={1} />

                <Tooltip title="Refresh">
                    <IconButton onClick={() => setRefreshKey(v => v + 1)}><RefreshIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Add Question">
                    <IconButton onClick={() => setOpenAdd(true)}><AddIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Manage Users">
                    <IconButton onClick={() => setOpenUsers(true)}><SettingsIcon /></IconButton>
                </Tooltip>
            </Stack>

            <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 3,
                        p: 2
                    }}
                >
                    {STATUS.map((s) => (
                        <Column
                            key={s}
                            id={s}
                            title={s}
                            items={columns[s]}
                            activeUser={activeUser}
                            onChanged={() => setRefreshKey(v => v + 1)}
                        />
                    ))}
                </Box>
            </DndContext>

            <EditQuestionModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSaved={() => { setOpenAdd(false); setRefreshKey(v => v + 1); }}
            />

            <UserManager
                open={openUsers}
                onClose={() => setOpenUsers(false)}
                onChanged={() => setRefreshKey(v => v + 1)}
            />
        </>
    );
}
