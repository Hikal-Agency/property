import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
// import Select from "react-select";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import Error404 from "../../Pages/Error";
import { MdFileUpload } from "react-icons/md";
import axios from "../../axoisConfig";

import { BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";
import { currencies } from "../_elements/SelectOptions";
import { selectBgStyles } from "../_elements/SelectStyles";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const AddItem = ({ openAddItem, setOpenAddItem, listITems }) => {
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [itemData, setITemData] = useState({
    itemName: null,
    itemPrice: 0,
    itemStatus: "available",
    notes: null,
    image: null,
    currency: null,
  });

  console.log("currencies:: ", currencies);

  console.log("ITem Data:::: ", itemData);

  const {
    t,
    currentMode,
    isLangRTL,
    i18n,
    User,
    primaryColor,
    darkModeColors,
    fontFam,
    BACKEND_URL,
    blurDarkColor,
    blurLightColor,
    themeBgImg,
  } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("auth-token");

  const handleChange = (e) => {
    console.log("handlechange ::: ", e.target.value);
    setITemData({
      ...itemData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleImgUpload = (e) => {
  //   const file = e.target.files[0];

  //   // Check if the file size is less than or equal to 1 MB (1024 * 1024 bytes)
  //   if (file && file.size <= 1024 * 1024) {
  //     setITemData({
  //       ...itemData,
  //       image: file,
  //     });

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     alert("Please choose an image with a size less than or equal to 1 MB.");
  //     // clear the input
  //     e.target.value = null;
  //     toast.error(`Item size should be less than 1mb.`, {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });

  //     return;
  //   }
  // };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("files:: ", file);

    // Check if the file size is less than or equal to 1 MB (1024 * 1024 bytes)

    if (file && file.size <= 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);

        const base64Image = reader.result;
        setITemData({
          ...itemData,
          image: file,
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please choose an image with a size less than or equal to 1 MB.");
      // clear the input
      e.target.value = null;
      toast.error(`Item size should be less than 1mb.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }
  };

  const addITem = async () => {
    setLoading(true);
    if (!itemData?.itemName) {
      setLoading(false);
      toast.error(`Item name is required.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }
    try {
      const addITem = await axios.post(`${BACKEND_URL}/items/store`, itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
      console.log("add item::::: ", addITem);
      setLoading(false);
      listITems();
      setOpenAddItem(false);

      toast.success(`New Item Added.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setITemData({
        itemName: null,
        itemPrice: null,
        itemStatus: null,
        notes: null,
        image: null,
      });
    } catch (error) {
      setLoading(false);
      console.log("error:::: ", error);
      toast.error(`Unable to add new item. Kindly try again`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

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
                            <img
                              src={imagePreview}
                              width="100px"
                              height="100px"
                            />
                          </div>
                        </div>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="contained-button-file"
                          type="file"
                          onChange={handleImgUpload}
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
                              right: isLangRTL(i18n.language) ? "2.5rem" : "",
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
                          size="small"
                          name="itemName"
                          value={itemData?.itemName}
                          onChange={handleChange}
                          required
                        />
                        <TextField
                          type={"number"}
                          // label={t("label_item_price")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          placeholder={t("label_item_price")}
                          variant="outlined"
                          name="itemPrice"
                          size="small"
                          value={itemData?.itemPrice}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <Box
                                sx={{
                                  minWidth: "90px",
                                  padding: 0,
                                  marginLeft: isLangRTL(i18n.language)
                                    ? "0px"
                                    : "0px",
                                  marginRight: isLangRTL(i18n.language)
                                    ? "0px"
                                    : "10px",
                                }}
                              >
                                <TextField
                                  value={currencies(t).find(
                                    (option) =>
                                      option.value === itemData?.currency
                                  )}
                                  name="currency"
                                  onChange={handleChange}
                                  options={currencies}
                                  label={t("label_select_currency")}
                                  // placeholder={t("label_select_currency")}
                                  className={`w-full p-0 ${
                                    !themeBgImg
                                      ? currentMode === "dark"
                                        ? "bg-[#333333]"
                                        : "bg-[#DDDDDD]"
                                      : currentMode === "dark"
                                      ? "blur-bg-dark"
                                      : "blur-bg-light"
                                  } `}
                                  size="small"
                                  select
                                  // menuPortalTarget={document.body}
                                  // styles={selectBgStyles(
                                  //   currentMode,
                                  //   primaryColor,
                                  //   blurDarkColor,
                                  //   blurLightColor
                                  // )}
                                >
                                  <MenuItem disabled selected value="">
                                    {t("label_select_currency")}
                                  </MenuItem>
                                  {currencies(t)?.map((currency) => (
                                    <MenuItem value={currency?.value}>
                                      {currency?.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Box>
                            ),
                          }}
                        />
                        <TextField
                          type={"text"}
                          label={t("label_note")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          name="notes"
                          size="small"
                          value={itemData?.notes}
                          onChange={handleChange}
                        />

                        {/* <FormControl fullWidth>
                          <InputLabel>{t("inventory_status")}</InputLabel>

                          <Select
                            label={t("ticket_category")}
                            size="medium"
                            onChange={handleChange}
                            value={itemData?.itemStatus}
                            name="itemStatus"
                            className="w-full mb-5"
                            required
                          >
                            <MenuItem disabled selected value="">
                              {t("inventory_status")}
                            </MenuItem>
                            <MenuItem value="Available">
                              {t("inventory_status_avail")}
                            </MenuItem>
                            <MenuItem value="Out Of Stock">
                              {t("inventory_status_stock")}
                            </MenuItem>
                          </Select>
                        </FormControl> */}
                        <TextField
                          select
                          label={t("inventory_status")}
                          className="w-full"
                          size="small"
                        >
                          <MenuItem value="Available">
                            {t("inventory_status_avail")}
                          </MenuItem>
                          <MenuItem value="Out Of Stock">
                            {t("inventory_status_stock")}
                          </MenuItem>
                        </TextField>
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
                      onClick={addITem}
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
