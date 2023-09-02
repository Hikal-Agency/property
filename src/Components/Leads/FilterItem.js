import { Box, TextField, MenuItem } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";

const FilterItem = ({
  filterValue,
  removeFilter,
  filterName,
  filters,
  changeFilter,
  filterOptions,
}) => {
  const {darkModeColors} = useStateContext();
  return (
    <>
      {filterValue ? (
        <Box
          onClick={() => removeFilter(filterName)}
          className="flex cursor-pointer items-center justify-around applied-filter"
        >
          <span>{filterValue}</span>
          <IoMdClose style={{ color: "white" }} />
        </Box>
      ) : (
        <TextField
        sx={darkModeColors}
          select
          id={filterName}
          value={
            filters?.find((filter) => filter.columnField === filterName)
              ?.value || "select_option"
          }
          onChange={(e) => changeFilter(filterName, e.target.value)}
          size="medium"
          className="mr-1 rounded"
          displayEmpty
          required
        >
          <MenuItem value="select_option" selected disabled>
            {filterName[0].toUpperCase() + filterName.slice(1)}
          </MenuItem>
          {filterOptions[filterName]?.map((option, index) => (
            <MenuItem key={option} value={option} sx={{ color: "black" }}>
              {option.trim()}
            </MenuItem>
          ))}
        </TextField>
      )}
    </>
  );
};

export default FilterItem;
