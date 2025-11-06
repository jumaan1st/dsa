import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    typography: {
        fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', 'Arial', sans-serif"
    },
    palette: {
        mode: "light",
        background: {
            default: "#F5F7FA",
            paper: "#FFFFFF"
        },
        primary: { main: "#3A7AFE" },    // blue
        secondary: { main: "#8358E8" },  // purple
        success: { main: "#4CAF50" },    // easy
        warning: { main: "#FFC107" },    // medium
        error: { main: "#FF5252" },      // hard
        divider: "#E6E8EB"
    },
    shape: { borderRadius: 6 },         // sharper UI
    components: {
        MuiPaper: { styleOverrides: { root: { borderRadius: 6 } } },
        MuiButton: { defaultProps: { disableElevation: true } },
    }
});
