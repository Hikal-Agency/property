import { Card } from "@mui/material";
import React from "react";
import { useStateContext } from "../../context/ContextProvider";

const ClientsListComp = () => {
  const { currentMode } = useStateContext();
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          background: "none",
          borderRight: "1px solid ",
          borderLeft: "1px solid ",
          borderBottom: "1px solid",
          borderColor: currentMode === "dark" ? "#f3f3f9" : "#f3f3f3",
          borderTop: "none",
        }}
        className="border-t-0 border-r-2 border-l-2 border-b-2"
      >
        <div
          className="flex space-x-2 items-center"
          style={{
            padding: 0,
            background: currentMode === "dark" ? "#080808" : "#f3f3f3",
          }}
        >
          <span className="bg-primary p-3">
            <h3
              className={`${currentMode === "dark" && "text-white"} text-bold`}
            >
              Account Type
            </h3>
          </span>
          <h3
            className={`${currentMode === "dark" ? "text-white" : "text-dark"}`}
          >
            Business Name
          </h3>
        </div>

        <div className="flex justify-between p-5">
          <div>
            <div className="flex space-between space-x-2">
              <h2
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Subdomain:{" "}
              </h2>
              <p
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                business.hikalcrm.com
              </p>
            </div>
          </div>
          <div>
            <div>
              icon
              <p>Name of person to contact</p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ClientsListComp;
