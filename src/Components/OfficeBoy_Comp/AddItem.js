import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import Error404 from "../../Pages/Error";
import { MdFileUpload } from "react-icons/md";

import { BiTrash } from "react-icons/bi";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const AddItem = ({ openAddItem, setOpenAddItem }) => {
  const [leadNotFound, setLeadNotFound] = useState(false);

  const {
    t,
    currentMode,
    isLangRTL,
    i18n,
    User,
    primaryColor,
    darkModeColors,
    fontFam,
  } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenAddItem(false);
    }, 1000);
  };
  return (
    <>
      <Modal
        keepMounted
        open={openAddItem}
        onClose={() => setOpenAddItem(false)}
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
            w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            // onClick={handleCloseTimelineModel}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
                bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className=" hover:border hover:border-white hover:rounded-full"
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
                 p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
                `}
          >
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div className="">
                <div className="ml-3 pb-3 ">
                  <div
                    className="w-full flex items-center py-1 mb-5"
                    style={{
                      position: "absolute",
                      right: -3,
                      top: 2,
                      color: (theme) => theme.palette.grey[500],
                      marginLeft: "10px",
                    }}
                  >
                    <div className="bg-primary h-10 w-1 rounded-full ml-3"></div>
                    <h1
                      className={`text-lg font-semibold mx-2 uppercase ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {t("add_item")}
                    </h1>
                  </div>
                </div>

                <div className="mt-5 " style={{ marginTop: "40px" }}>
                  <form>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5 py-5">
                      <Box sx={darkModeColors} className="p-2">
                        {/* <Box
                          sx={{
                            ...darkModeColors,
                            "& .MuiTypography-root": {
                              fontFamily: fontFam,
                            },
                          }}
                        >
                          <label className="font-semibold mb-1">
                            <span className="text-primary">{`${t("offer")} ${t(
                              "label_validity"
                            )}`}</span>
                          </label>
                          <br></br>
                        </Box> */}

                        <div className="  mb-5 flex items-center justify-center ">
                          <div className=" rounded-lg border">
                            <img src="./dddd" width="100px" height="100px" />
                          </div>
                        </div>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="contained-button-file"
                          type="file"
                          //   onChange={handleImgUpload}
                        />
                        <label htmlFor="contained-button-file">
                          <Button
                            variant="contained"
                            size="medium"
                            className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold my-3"
                            style={{
                              color: "#ffffff",
                              border: "1px solid white",
                              fontFamily: fontFam,
                            }}
                            component="span" // Required so the button doesn't automatically submit form
                            disabled={loading ? true : false}
                            startIcon={
                              loading ? null : (
                                <MdFileUpload className="mx-2" size={16} />
                              )
                            }
                          >
                            <span>{t("button_upload_image")}</span>
                          </Button>
                        </label>
                      </Box>
                      <Box
                        sx={{
                          ...darkModeColors,
                          "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                            {
                              right: isLangRTL(i18n.language)
                                ? "2.5rem"
                                : "inherit",
                              transformOrigin: isLangRTL(i18n.language)
                                ? "right"
                                : "left",
                            },
                          "& legend": {
                            textAlign: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        }}
                        className="p-2"
                      >
                        <TextField
                          type={"text"}
                          label={t("label_item_name")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          name="offerTitle"
                          size="small"
                          // value={offerData.offerTitle}
                          // onChange={(e) =>
                          //   setOfferData({ ...offerData, offerTitle: e.target.value })
                          // }
                          required
                        />
                        <TextField
                          type={"number"}
                          label={t("label_item_price")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          name="offerTitle"
                          size="small"
                          // value={offerData.offerTitle}
                          // onChange={(e) =>
                          //   setOfferData({ ...offerData, offerTitle: e.target.value })
                          // }
                        />
                        <TextField
                          type={"text"}
                          label={t("label_note")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          name="offerTitle"
                          size="small"
                          // value={offerData.offerTitle}
                          // onChange={(e) =>
                          //   setOfferData({ ...offerData, offerTitle: e.target.value })
                          // }
                        />
                      </Box>
                    </div>

                    <Button
                      type="submit"
                      size="medium"
                      style={{
                        color: "white",
                        fontFamily: fontFam,
                      }}
                      className="bg-btn-primary w-full text-white rounded-lg py-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
                      //   onClick={handleClick}
                      disabled={loading ? true : false}
                    >
                      {loading ? (
                        <CircularProgress
                          size={23}
                          sx={{ color: "white" }}
                          className="text-white"
                        />
                      ) : (
                        <span>{t("add_item")}</span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddItem;
