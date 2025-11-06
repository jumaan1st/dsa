import { useDroppable } from "@dnd-kit/core";
import { Paper, Box, Typography, Chip } from "@mui/material";
import QuestionCard from "./QuestionCard";

export default function Column({ id, title, items, activeUser, onChanged }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <Paper
            ref={setNodeRef}
            elevation={isOver ? 6 : 2}
            sx={{
                p: 2,
                minHeight: "75vh",
                background: "white",
                border: "1px solid",
                borderColor: isOver ? "primary.light" : "divider",
                transition: "0.2s",
            }}
        >
            <Box
                sx={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    mb: 1.5, p: 0.5, borderBottom: "1px solid #E5E7EB",
                }}
            >
                <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
                <Chip label={items.length} size="small" variant="outlined" />
            </Box>

            <Box display="grid" gap={1.25}>
                {items.map(q => (
                    <QuestionCard key={q._id} q={q} activeUser={activeUser} onChanged={onChanged} />
                ))}
            </Box>
        </Paper>
    );
}
