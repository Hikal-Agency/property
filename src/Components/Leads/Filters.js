import { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Box } from "@mui/material";
import FilterItem from "./FilterItem";

const Filters = ({ setFilt, data, allFilters }) => {
  const { darkModeColors } = useStateContext();
  const [filters, setFilters] = useState([]);
  const [options, setOptions] = useState({});

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
    setFilters(
      filters.filter((f) => {
        return f.columnField !== filter;
      })
    );
  };

  useEffect(() => {
    setFilt(filters);
  }, [filters]);

  useEffect(() => {
    console.log("Dat::", data)

    const allOptions = {};
    allFilters?.forEach((filter) => {
        if(filter === "leadType") {
            const options1 = data?.filter((l) => l["leadType"]).map((l) => l["leadType"]);
            const options2 = data?.filter((l) => l["enquiryType"]).map((l) => l["enquiryType"]);
            allOptions[filter] = [...new Set(options1), ...new Set(options2)];
        } else {
            const options = data?.filter((l) => l[filter]).map((l) => l[filter]);
            allOptions[filter] = [...new Set(options)];
        }
    })

    setOptions(allOptions);
    console.log("All options", allOptions)
  }, [data]);

  const values = {};
  allFilters.forEach((f) => {
    const val = filters.find((filter) => filter.columnField === f)?.value;
    values[f] = val;
  })

  return (
    <>
      <Box
        className="flex items-center mt-3 mb-2"
        sx={{
          "& .MuiSelect-select": {
            padding: "2px",
            paddingLeft: "6px !important",
            paddingRight: "20px",
            borderRadius: "8px",
          },
          "& .MuiInputBase-root": {
            width: "max-content",
            marginRight: "5px"
          },
          "& .applied-filter": {
            background: "#da1f26",
            borderRadius: 4,
            width: "max-content",
            padding: "3px 8px",
            color: "white",
            marginRight: "0.25rem"
          },
          "& .applied-filter span": {
            marginRight: "3px",
          },
        }}
      >

      {allFilters.map((filter) => {
        return <FilterItem
        key={filter}
          filterName={filter}
          filterValue={values[filter]}
          changeFilter={changeFilter}
          removeFilter={removeFilter}
          filterOptions={options}
          filters={filters}
        />
      })}
      </Box>
    </>
  );
};

export default Filters;
