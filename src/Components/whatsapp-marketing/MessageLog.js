import React from "react";
import { Box } from "@mui/material";

function DynamicDiv({ content, color }) {
  return (
    <Box
      className="rounded py-2 px-4 text-white mb-2"
      style={{background: color }}
    >
      <Box className="flex justify-end font-bold" style={{ fontSize: 14 }}>
        <span>{content.created_at}</span>
      </Box>
      <div style={{whiteSpace: "pre-wrap"}}>{content.message}</div>
    </Box>
  );
}

export default DynamicDiv;
