import { useState } from "react";
import { Box, Select, MenuItem } from "@mui/material";

const Filters = ({setFilt, data}) => {
    const [filters, setFilters] = useState({
        project: "",
    });
    return (
        <>
            <Box className="flex items-center">
        <Select
          id="project"
          value={
            filters?.project
          }
          label="Manager"
          onChange={(e) => setFilters({...filters, project: e.target.value})}
          size="medium"
          className="w-full border border-gray-300 rounded "
          displayEmpty
          required
          sx={{ border: "1px solid #000000" }}
        >
          <MenuItem value="select_manager" selected>
            Select Manager
          </MenuItem>
            {data?.map((manager, index) => (
              <MenuItem key={index} value={manager?.id} sx={{ color: "black" }}>
                {manager?.userName}
              </MenuItem>
            ))}
        </Select>
            </Box>
        </>
    );
}

export default Filters;