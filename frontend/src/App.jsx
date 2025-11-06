import { useState } from "react";
import {
    Container, Box, ToggleButtonGroup, ToggleButton,
    Typography, IconButton, Tooltip
} from "@mui/material";
import Board from "./components/Board";
import ListView from "./components/ListView";
import ColorLensIcon from "@mui/icons-material/ColorLens";

export default function App() {
    const [view, setView] = useState("board");

    return (
        <Container maxWidth="xl" sx={{ py: 3, background: "transparent" }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" fontWeight={800}>DSA Tracker</Typography>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <ToggleButtonGroup
                        exclusive size="small" value={view}
                        onChange={(e, v) => v && setView(v)}
                    >
                        <ToggleButton value="board">BOARD</ToggleButton>
                        <ToggleButton value="list">LIST</ToggleButton>
                    </ToggleButtonGroup>
                    <Tooltip title="Theme: Material UI (customized)">
                        <IconButton><ColorLensIcon /></IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {view === "board" ? <Board /> : <ListView />}
        </Container>
    );
}
