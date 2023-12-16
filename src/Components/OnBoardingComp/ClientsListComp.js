import { Card } from "@mui/material";
import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { FaUser, FaPhone } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const ClientsListComp = () => {
  const { currentMode } = useStateContext();
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          background: "none",
        }}
        className="border-t-0 border-r-2 border-l-2 border-b-2"
      >
        <div
          className="flex justify-between space-x-2 items-center"
          style={{
            padding: 0,
            background: currentMode === "dark" ? "#080808" : "#f3f3f3",
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="bg-primary p-3">
              <h3
                className={`${
                  currentMode === "dark" && "text-white"
                } text-bold`}
              >
                Account Type
              </h3>
            </span>
            <h3
              className={`${
                currentMode === "dark" ? "text-white" : "text-dark"
              }`}
            >
              Business Name
            </h3>
          </div>
          <div className="flex items-center space-x-2 pr-3">
            <span className="bg-primary p-3">
              <h3
                className={`${
                  currentMode === "dark" && "text-white"
                } text-bold`}
              >
                Account Type
              </h3>
            </span>
            <h3
              className={`${
                currentMode === "dark" ? "text-white" : "text-dark"
              }`}
            >
              Business Name
            </h3>
          </div>
        </div>

        <div
          className="flex justify-between p-5 items-center"
          style={{
            borderRight: "1px solid ",
            borderLeft: "1px solid ",
            borderBottom: "1px solid",
            borderColor: currentMode === "dark" ? "#f3f3f9" : "#f3f3f3",
            borderTop: "none",
          }}
        >
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
            <div className="flex space-between space-x-2 mt-3">
              <h2
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                IP Address:{" "}
              </h2>
              <p
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Designated IP
              </p>
            </div>
            <div className="flex space-between space-x-2 mt-3">
              <h2
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Country:{" "}
              </h2>
              <p
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Country Name
              </p>
            </div>
            <div className="flex space-between space-x-2 mt-3">
              <h2
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Registered on:{" "}
              </h2>
              <p
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Date
              </p>
            </div>
            <div className="flex space-between space-x-2 mt-3">
              <h2
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Expires on:{" "}
              </h2>
              <p
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Date
              </p>
            </div>
          </div>
          <div>
            <div className="flex space-between space-x-3  items-center">
              <FaUser
                size={16}
                color={currentMode === "dark" ? "#fff" : "#000"}
              />

              <p>Name of person to contact</p>
            </div>
            <div className="flex space-between space-x-3 mt-3 items-center">
              <FaPhone
                size={16}
                color={currentMode === "dark" ? "#fff" : "#000"}
              />

              <p>+9232312323132</p>
            </div>
            <div className="flex space-between space-x-3 mt-3 items-center">
              <IoIosMail
                size={16}
                color={currentMode === "dark" ? "#fff" : "#000"}
              />

              <p>test@gmail.com</p>
            </div>
            <div className="flex space-between space-x-3 mt-3 items-center">
              <IoIosMail
                size={16}
                color={currentMode === "dark" ? "#fff" : "#000"}
              />

              <p>test@gmail.com</p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ClientsListComp;
