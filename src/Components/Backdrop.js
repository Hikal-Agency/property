import { CircularProgress } from "@mui/material";
import React from "react";
import { Backdrop as Backdrop2 } from "@mui/material";
import { useStateContext } from "../context/ContextProvider";

const Backdrop = () => {
  const { openBackDrop, setopenBackDrop } = useStateContext();
  return (
    <Backdrop2
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={openBackDrop}
    >
      <div className="flex items-center justify-center space-x-2">
        <CircularProgress sx={{ color: "white" }} />
        <h1 className="font-semibold text-lg">Loading</h1>
      </div>
    </Backdrop2>
  );
};

export default Backdrop;
