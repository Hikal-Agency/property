import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Tooltip,
  Drawer,
  MenuItem,
  Box,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Checkbox,
  FormGroup,
} from "@mui/material";
import Select from "react-select";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { MdClose } from "react-icons/md";

import {
  enquiry_options,
  project_status_options,
} from "../../Components/_elements/SelectOptions";
import MultiStepForm from "./MultiStepForm";
import HeadingTitle from "../_elements/HeadingTitle";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const AddNewListingModal = ({
  LeadData,
  setListingModalOpen,
  handleCloseListingModal,
  FetchListings,
}) => {
  console.log("set listing modal open: ", setListingModalOpen);
  const {
    currentMode,
    darkModeColors,
    User,
    BACKEND_URL,
    t,
    isLangRTL,
    i18n,
    primaryColor,
    fontFam,
  } = useStateContext();

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseListingModal();
    }, 1000);
  };

  return (
    <>
      <Modal
        keepMounted
        open={setListingModalOpen}
        onClose={() => handleCloseListingModal()}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
        w-[100vw] h-[100vh] flex items-start justify-end`}
        >
          <button
            // onClick={handleLeadModelClose}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className="hover:border hover:border-white hover:rounded-full"
            />
          </button>
          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-dark text-white"
                : "bg-light text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && "border-r-2 border-primary"
                : currentMode === "dark" && "border-l-2 border-primary"
            }
             p-5 h-[100vh] w-[85vw] overflow-y-scroll
            `}
          >
            <HeadingTitle title={t("btn_add_new_listing")} />

            <div className={`w-full p-4`}>
              <MultiStepForm FetchListings={FetchListings} />
            </div>

            {/* <Box
                sx={darkModeColors}
                className="w-full grid grid-cols-1 gap-5 my-5"
              >
                <ListingLocation
                  listingLocation={listingLocation}
                  currLocByDefault={true}
                  setListingLocation={setListingLocation}
                  city={city}
                  setCity={setCity}
                  country={country}
                  setCountry={setCountry}
                  required
                />
              </Box> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddNewListingModal;
