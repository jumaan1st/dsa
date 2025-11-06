import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    List, ListItem, ListItemText, ListItemSecondaryAction, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";

export default function UserManager({ open, onClose, onChanged }) {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState("");

    const load = async () => {
        const r = await fetch("http://localhost:8080/users");
        setUsers(await r.json());
    };

    useEffect(() => { if (open) load(); }, [open]);

    const addOrUpdate = async () => {
        if (!name.trim()) return;
        if (editId) {
            await fetch(`http://localhost:8080/users/${editId}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
        } else {
            await fetch("http://localhost:8080/users", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
        }
        setName(""); setEditId(""); await load(); onChanged();
    };

    const del = async (id) => {
        await fetch(`http://localhost:8080/users/${id}`, { method: "DELETE" });
        await load(); onChanged();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Manage Users</DialogTitle>
            <DialogContent>
                <TextField
                    label={editId ? "Rename user" : "Add user"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth sx={{ mt: 1, mb: 2 }}
                />
                <Button variant="contained" onClick={addOrUpdate}>
                    {editId ? "Save" : "Add"}
                </Button>

                <List dense sx={{ mt: 2 }}>
                    {users.map(u => (
                        <ListItem key={u._id} divider>
                            <ListItemText primary={u.name} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => { setEditId(u._id); setName(u.name); }}><EditIcon /></IconButton>
                                <IconButton onClick={() => del(u._id)}><DeleteIcon /></IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
