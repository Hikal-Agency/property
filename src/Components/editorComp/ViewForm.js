import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import axois from "../../axoisConfig.js";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider.js";
import {
  DateOfBirth,
  Email,
  FirstName,
  FullName,
  LastName,
  Phone,
  ButtonComp,
  Address,
  City,
  Country,
  State,
  PostalCode,
  Website,
  Organization,
  Text,
  Image,
  Captcha,
  Source,
  TandC,
} from "./FormEditorComponents/QuickAddComponents.js/index.js";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};
const ViewForm = ({ fields, setViewFormModal, viewFormModal }) => {
  const [actualComponents, setActualComponents] = useState([]);
  const { currentMode } = useStateContext();
  const components = {
    DateOfBirth,
    Email,
    FirstName,
    FullName,
    LastName,
    Phone,
    ButtonComp,
    Address,
    City,
    Country,
    State,
    PostalCode,
    Website,
    Organization,
    Text,
    Image,
    Captcha,
    Source,
    TandC,
  };
  useEffect(() => {
    setActualComponents(fields);
    console.log(fields, "fields");
  }, [fields]);

  return (
    <Modal
      keepMounted
      open={viewFormModal}
      onClose={() => setViewFormModal(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        style={style}
        className={`w-[calc(30%-20px)] md:w-[30%]  ${
          // currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          currentMode === "dark"
            ? "bg-dark-neu text-white"
            : "bg-light text-black"
        } absolute top-1/2 left-1/2 p-5 rounded-md`}
      >
        <div>
          <Box
            sx={{
              boxShadow: 2,
              width: "100%",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <div className="p-10 flex flex-col gap-5">
              {actualComponents?.map((comp, index) => {
                // const Component = components[comp?.component];
                const Component = comp?.component;
                return (
                  <Component
                    label={comp?.label}
                    shortLabel={comp?.shortLabel}
                    placeholder={comp?.placeholder}
                    queryKey={comp?.queryKey}
                    width={comp?.width}
                    url={comp?.url}
                    isRequired={comp?.isRequired}
                    text={comp?.text}
                    htmlContent={comp?.html}
                    isDevelopment={false}
                    onChange={() => {}}
                  />
                );
              })}
            </div>
          </Box>
        </div>
      </div>
    </Modal>
  );
};

export default ViewForm;
