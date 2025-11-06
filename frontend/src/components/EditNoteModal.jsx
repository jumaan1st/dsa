import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function EditNoteModal({ open, onClose, questionId, activeUser, initialNote, onSaved }) {
    const [saving, setSaving] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "Write notes like Notion..." })
        ],
        content: initialNote || "",
    });

    useEffect(() => {
        if (open && editor) editor.commands.setContent(initialNote || "");
    }, [open, initialNote, editor]);

    const save = async () => {
        setSaving(true);
        await fetch(`http://localhost:8080/questions/${questionId}/note`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: activeUser, note: editor.getHTML() })
        });
        setSaving(false);
        onSaved();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Note ({activeUser})</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        p: 2,
                        minHeight: 250,
                        "& .ProseMirror": { outline: "none" }
                    }}
                >
                    <EditorContent editor={editor} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" disabled={saving} onClick={save}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
