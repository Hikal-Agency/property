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
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { VscCallOutgoing, VscMail, VscEdit } from "react-icons/vsc";
import { IoIosAlert } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { BiBlock, BiBed } from "react-icons/bi";
import {
  BsShuffle,
  BsTelephone,
  BsEnvelopeAt,
  BsType,
  BsHouseGear,
  BsBuildings,
  BsTrash,
  BsBuildingGear,
  BsPersonPlus,
  BsBookmarkFill,
  BsPersonGear,
  BsChatLeftText,
} from "react-icons/bs";

const AddDeveloper = ({ openAddDev, setOpenAddDev }) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    themeBgImg,
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState(false);
  const [devData, setDevData] = useState({
    developerName: null,
    founder: null,
    ceo: null,
    developerContact: null,
    developerEmail: null,
    address: null,
    rm_name: null,
    rm_contact: null,
    rm_email: null,
    addedBy: null,
  });

  const handleChange = (e) => {
    const data = e.target.value;
    const name = e.target.name;

    setDevData((prev) => ({
      ...prev,
      [name]: data,
    }));
  };

  const [isClosing, setIsClosing] = useState(false);
  const handleEmail = (e) => {
    setEmailError(false);
    const value = e.target.value;
    console.log(value);
    // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const emailRegex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (emailRegex.test(value)) {
      setEmailError(false);
    } else {
      setEmailError("Kindly enter a valid email.");
      // setLeadEmail("");
      return;
    }
    setLeadEmail(value);
    console.log("Email state: ", LeadEmail);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenAddDev(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const AddLead = () => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");

    // const data = {
    //   leadId: LeadData.leadId || LeadData.id,
    //   leadNote: note || AddNoteTxt,
    //   addedBy: User?.id,
    //   addedByName: User?.userName,
    // };
    // axios
    //   .post(`${BACKEND_URL}/leadNotes`, data, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   })
    //   .then((result) => {
    //     console.log("Result: ");
    //     console.log("Result: ", result);
    //     setaddNoteloading(false);
    //     setAddNoteTxt("");
    //     if (!note) {
    //       toast.success("Note added Successfully", {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "light",
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     setaddNoteloading(false);
    //     console.log(err);
    //     toast.error("Soemthing Went Wrong! Please Try Again", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //   });
  };

  return (
    <>
      <Modal
        keepMounted
        open={openAddDev}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        openAfterTransition
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
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
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            {loading ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="mx-auto">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      AddLead();
                    }}
                    disabled={loading ? true : false}
                  >
                    <div className="w-full flex items-center pb-3">
                      <div className="bg-primary h-10 w-1 rounded-full"></div>
                      <h1
                        className={`text-lg font-semibold mx-2 uppercase ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {t("add_developer_modal")}
                      </h1>
                    </div>

                    <div
                      className={`${
                        themeBgImg &&
                        (currentMode === "dark"
                          ? "blur-bg-dark shadow-sm"
                          : "blur-bg-light shadow-sm")
                      } p-5 rounded-lg `}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5 mt-5">
                        <div className="px-4">
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? `text-white`
                                  : "text-black"
                              } text-center font-semibold pb-5`}
                            >
                              {t("developer_detail")}
                            </h4>{" "}
                            <TextField
                              id="LeadEmailAddress"
                              name="developerName"
                              type={"text"}
                              label={t("form_developer_name")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              required
                            />
                            <TextField
                              id="notes"
                              type={"text"}
                              label={t("form_developer_founder")}
                              name="founder"
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              //   value={LeadNotes}
                              //   onChange={(e) => setLeadNotes(e.target.value)}
                            />
                            <TextField
                              id="Manager"
                              type="text"
                              name="ceo"
                              label={t("form_developer_ceo")}
                              className="w-full"
                              sx={{
                                marginBottom: "1.25rem !important",
                                color:
                                  currentMode === "dark"
                                    ? "#ffffff"
                                    : "#000000",
                                // pointerEvents: "none",
                              }}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </div>

                        <div className="px-4">
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? `text-white`
                                  : "text-black"
                              } text-center font-semibold pb-5`}
                            >
                              {t("contact_detail")}
                            </h4>
                            <TextField
                              id="Project"
                              type={"text"}
                              name="developerContact"
                              label={t("form_developer_contact")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              //   value={LeadProject}
                            />
                            <TextField
                              id="Project"
                              type={"text"}
                              name="developerEmail"
                              label={t("form_developer_email")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              //   value={LeadProject}
                            />

                            <TextField
                              id="LeadEmailAddress"
                              type={"email"}
                              name="address"
                              label={t("form_developer_emailAddress")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </div>

                        <div className="px-4">
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? `text-white`
                                  : "text-black"
                              } text-center font-semibold pb-5`}
                            >
                              {t("r_manager_detail")}
                            </h4>
                            <TextField
                              id="LeadName"
                              type={"text"}
                              name="rm_name"
                              label={t("form_developer_fullName")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              // required
                            />

                            {error && (
                              <Typography variant="body2" color="error">
                                {error}
                              </Typography>
                            )}
                            <TextField
                              id="LeadEmailAddress"
                              type={"email"}
                              label={t("form_developer_emailAddress")}
                              name="rm_email"
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                            />

                            <TextField
                              id="LeadEmailAddress"
                              type={"text"}
                              label={t("form_developer_contactNumber")}
                              name="rm_contact"
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </div>
                      </div>

                      <div className="">
                        <Button
                          className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                          ripple={true}
                          style={{
                            background: `${primaryColor}`,
                          }}
                          size="lg"
                          type="submit"
                          disabled={loading ? true : false}
                        >
                          {loading ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                              className="text-white"
                            />
                          ) : (
                            <span className="text-white">
                              {t("submit_developer_btn")}
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddDeveloper;
