import { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Box, TextField, MenuItem } from "@mui/material";
import {IoMdClose} from "react-icons/io";

const Filters = ({ setFilt, data }) => {
  const { darkModeColors } = useStateContext();
  const [filters, setFilters] = useState([]);
  const [options, setOptions] = useState({
    project: ["project"],
  });

  const changeFilter = (filter, value) => {
    setFilters([
      ...filters,
      {
        columnField: filter,
        operatorValue: "equals",
        value: value,
      },
    ]);
  };

  const removeFilter = (filter) => {
    setFilters(filters.filter((f) => {
        return f.columnField !== filter
    }));
  }

  useEffect(() => {
    const projects = [];
    console.log(data);
  }, []);

  useEffect(() => {
    setFilt(filters);
  }, [filters]);

  const projectValue = filters.find((filter) => filter.columnField === "project")?.value;
  return (
    <>
      <Box
        className="flex items-center mt-3 mb-2"
        sx={{
          ...darkModeColors,
          "& .MuiSelect-select": {
            padding: "4px !important",
            paddingLeft: "6px !important",
          },
          "& .MuiInputBase-root": {
            width: "100px",
          },
          "& .applied-filter": {
            background: "#da1f26", 
            borderRadius: 4, 
            width: "100px",
            padding: "4px",
            color: "white",
          }, 
          "& .applied-filter span": {
            marginRight: "3px" 
          }
        }}
      >
      {projectValue ? <Box onClick={() => removeFilter("project")} className="flex items-center justify-around applied-filter">
        <span>{projectValue}</span>
        <IoMdClose style={{color: "white"}}/>
      </Box> :
        <TextField
          select
          id="project"
          value={
            filters?.find((filter) => filter.columnField === "project")
              ?.value || "select_project"
          }
          onChange={(e) => changeFilter("project", e.target.value)}
          size="medium"
          className="w-full border border-gray-300 rounded "
          displayEmpty
          required
        >
          <MenuItem value="select_project" selected disabled>
            Project
          </MenuItem>
          {options.project?.map((project, index) => (
            <MenuItem key={project} value={project} sx={{ color: "black" }}>
              {project}
            </MenuItem>
          ))}
        </TextField>
      }
      </Box>
    </>
  );
};

export default Filters;
