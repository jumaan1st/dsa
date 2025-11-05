import { MenuItem, Select } from "@mui/material";
import { STATUS_OPTIONS } from "../constants/status";

export default function StatusSelect({ value, onChange }) {
    return (
        <Select
            value={value || "Not Started"}
            size="small"
            onChange={(e) => onChange(e.target.value)}
            sx={{ minWidth: 140 }}
        >
            {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </Select>
    );
}
