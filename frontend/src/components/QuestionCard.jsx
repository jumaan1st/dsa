import { useDraggable } from "@dnd-kit/core";
import {
    Card, CardContent, CardActions, Typography, Chip, IconButton, Tooltip, Link, Menu, MenuItem, Box
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditNoteModal from "./EditNoteModal";
import EditQuestionModal from "./EditQuestionModal";
import { useMemo, useState } from "react";

const diffColor = (d) => (d === "Easy" ? "success" : d === "Medium" ? "warning" : "error");

export default function QuestionCard({ q, activeUser, onChanged }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: q._id });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            boxShadow: "0 10px 28px rgba(0,0,0,0.18)"
        }
        : undefined;

    const notePreview = useMemo(() => (q.notes?.[activeUser] || ""), [q, activeUser]);
    const [anchor, setAnchor] = useState(null);
    const [openNote, setOpenNote] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const handleDelete = async () => {
        await fetch(`http://localhost:8080/questions/${q._id}`, { method: "DELETE" });
        onChanged();
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            elevation={2}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                transition: "0.25s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 6px 20px rgba(58,122,254,0.15)" }
            }}
        >
              {/* DRAG HANDLE */}
                  <Box
                      {...listeners}
                      {...attributes}
                      sx={{
                          cursor: "grab",
                          bgcolor: "#f1f3f7",
                          px: 2, py: 1,
                          borderBottom: "1px solid #e6e9ef"
                      }}
                  >
                      <Typography variant="subtitle2" sx={{ userSelect: "none" }}>Drag to move</Typography>
                  </Box>

                  <CardContent sx={{ pt: 1.5 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                          <Link href={q.url} target="_blank" underline="hover">{q.question}</Link>
                      </Typography>

                      <Chip size="small" label={q.difficulty} color={diffColor(q.difficulty)} variant="outlined" sx={{ mt: 1 }} />

                      {notePreview && (
                          <div
                              style={{ marginTop: 8, color: "#666", fontSize: "0.9rem" }}
                              dangerouslySetInnerHTML={{
                                  __html: notePreview.length > 220 ? notePreview.slice(0, 220) + "…" : notePreview
                              }}
                          />
                      )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between", pt: 0 }}>
                      <Tooltip title="Edit Note">
                          <IconButton onClick={() => setOpenNote(true)}><NotesIcon /></IconButton>
                      </Tooltip>

                      <div>
                          <IconButton onClick={(e) => setAnchor(e.currentTarget)}><MoreVertIcon /></IconButton>
                          <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)}>
                              <MenuItem onClick={() => { setOpenEdit(true); setAnchor(null); }}>Edit</MenuItem>
                              <MenuItem onClick={() => { setAnchor(null); handleDelete(); }}>Delete</MenuItem>
                          </Menu>
                      </div>
                  </CardActions>

                  <EditNoteModal
                      open={openNote}
                      onClose={() => setOpenNote(false)}
                      questionId={q._id}
                      activeUser={activeUser}
                      initialNote={q.notes?.[activeUser] || ""}
                      onSaved={() => { setOpenNote(false); onChanged(); }}
                  />

                  <EditQuestionModal
                      open={openEdit}
                      onClose={() => setOpenEdit(false)}
                      initial={q}
                      onSaved={() => { setOpenEdit(false); onChanged(); }}
                  />
        </Card>
    );
}
