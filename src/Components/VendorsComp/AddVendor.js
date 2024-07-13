import React, { useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import Select from "react-select";
import {
  commission_type,
  countries_list,
  currencies,
  transaction_type,
  vendor_type,
} from "../_elements/SelectOptions";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { MdClose, MdFileUpload } from "react-icons/md";
import { selectStyles } from "../_elements/SelectStyles";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import moment from "moment";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import HeadingTitle from "../_elements/HeadingTitle";

const AddVendor = ({
  openVendorModal,
  setOpenVendorModal,
  edit,
  fetchVendors,
}) => {
  console.log("Vendor data: ", openVendorModal);
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    fontFam,
    t,
    isLangRTL,
    i18n,
    primaryColor,
    themeBgImg,
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [loading, setLoading] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [value, setValue] = useState();
  const [error, setError] = useState(false);
  let editData;

  if (edit) {
    console.log("edit : ", edit);
    editData = openVendorModal;
  }

  const [vendorData, setVendorData] = useState({
    type: editData?.type || null,
    vendor_name: editData?.vendor_name || null,
    address: editData?.address || null,
    contact: editData?.contact || null,
    country: editData?.country || null,
    pobox: editData?.pobox || null,
    trn: editData?.trn || null,
    email: editData?.email || null,
    link: editData?.link || null,
    person_to_contact: editData?.person_to_contact || null,
  });

  console.log("vendor data:: ", vendorData);

  const handleContact = () => {
    setError(false);
    const inputValue = value;
    console.log("Phone: ", inputValue);
    if (inputValue && isPossiblePhoneNumber(inputValue)) {
      console.log("Possible: ", inputValue);
      if (isValidPhoneNumber(inputValue)) {
        setVendorData({
          ...vendorData,
          contact: formatPhoneNumberIntl(inputValue),
        });
        console.log("Valid lead contact: ", vendorData?.contact);
        console.log("Valid input: ", inputValue);
        setError(false);
      } else {
        setError("Not a valid number.");
      }
    } else {
      setError("Not a valid number.");
    }
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setVendorData({
      ...vendorData,
      [id]: value,
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenVendorModal();
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const AddTransaction = () => {
    setBtnLoading(true);
    const token = localStorage.getItem("auth-token");

    if (!vendorData?.vendor_name) {
      toast.error("Vendor name required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setBtnLoading(false);
      return;
    }

    let url;

    if (edit) {
      url = `${BACKEND_URL}/vendors/${editData?.id}`;
    } else {
      url = `${BACKEND_URL}/vendors`;
    }

    axios
      .post(url, vendorData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);

        if (result?.data?.status === false) {
          toast.error(result?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setBtnLoading(false);
          return;
        }
        toast.success(`Vendor ${edit ? "Updated" : "Added"} successfully.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setBtnLoading(false);
        handleClose();
        fetchVendors();
        // if (edit) {
        //   fetchVendors();
        // }
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        toast.error("Soemthing Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <Modal
      keepMounted
      open={openVendorModal}
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
              ? "bg-dark text-white"
              : "bg-light text-black"
          } ${
            isLangRTL(i18n.language)
              ? currentMode === "dark" && " border-primary border-r-2"
              : currentMode === "dark" && " border-primary border-l-2"
          }
            p-4 h-[100vh] w-[85vw] overflow-y-scroll 
          `}
        >
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <HeadingTitle
                title={edit ? t("update_vendor") : t("add_vendor")}
              />

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                {/* Vendor DETAILS  */}
                <div
                  className={`p-5
                  ${
                    currentMode === "dark"
                      ? "bg-dark-neu text-white"
                      : "bg-light-neu text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("vendor_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                        // marginTop:"20p"
                      }}
                    >
                      <Select
                        id="type"
                        options={vendor_type(t)?.map((ven) => ({
                          value: ven.value,
                          label: ven.label,
                        }))}
                        value={vendor_type(t)?.find(
                          (ven) => ven.value === vendorData?.type
                        )}
                        onChange={(e) => {
                          setVendorData({
                            ...vendorData,
                            type: e.value,
                          });
                        }}
                        placeholder={t("type")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      <TextField
                        id="vendor_name"
                        type={"text"}
                        label={t("form_vendor_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={vendorData?.vendor_name}
                        onChange={handleChange}
                        required
                      />

                      <TextField
                        id="address"
                        type={"text"}
                        label={t("label_address")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={vendorData?.address}
                        onChange={handleChange}
                        required
                      />

                      <Select
                        id="country"
                        options={countries_list(t)}
                        value={countries_list(t)?.find(
                          (curr) => curr.value === vendorData?.country
                        )}
                        onChange={(e) => {
                          setVendorData({
                            ...vendorData,
                            country: e.value,
                          });
                        }}
                        placeholder={t("label_country")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      <TextField
                        id="pobox"
                        type={"text"}
                        label={t("po_box")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={vendorData?.pobox}
                        onChange={handleChange}
                      />

                      <TextField
                        id="trn"
                        type={"text"}
                        label={t("trn")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={vendorData?.trn}
                        onChange={handleChange}
                      />
                    </Box>
                  </div>
                </div>

                {/* Person to contact  */}
                <div
                  className={`p-5
                  ${
                    currentMode === "dark"
                      ? "bg-dark-neu text-white"
                      : "bg-light-neu text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("person_to_contact")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box sx={darkModeColors} className="p-2">
                      <TextField
                        id="person_to_contact"
                        type={"text"}
                        label={t("name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={vendorData?.person_to_contact}
                        onChange={handleChange}
                      />

                      <PhoneInput
                        placeholder={t("label_contact_number")}
                        value={value}
                        onChange={(value) => setValue(value)}
                        onKeyUp={handleContact}
                        error={error}
                        className={` ${classNames({
                          "dark-mode": currentMode === "dark",
                          "phone-input-light": currentMode !== "dark",
                          "phone-input-dark": currentMode === "dark",
                        })} mb-5`}
                        size="small"
                        style={{
                          background: `${
                            !themeBgImg
                              ? currentMode === "dark"
                                ? "#000000"
                                : "#FFFFFF"
                              : "transparent"
                            // : (currentMode === "dark" ? blurDarkColor : blurLightColor)
                          }`,
                          "& .PhoneInputCountryIconImg": {
                            color: "#fff",
                          },
                          color: currentMode === "dark" ? "white" : "black",
                          border: `1px solid ${
                            currentMode === "dark" ? "#EEEEEE" : "#666666"
                          }`,
                          borderRadius: "5px",
                          outline: "none",
                        }}
                        inputStyle={{
                          outline: "none !important",
                        }}
                        required
                      />

                      {error && (
                        <Typography variant="body2" color="error">
                          {error}
                        </Typography>
                      )}

                      <TextField
                        id="email"
                        type={"text"}
                        label={t("label_email")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={vendorData?.email}
                        onChange={handleChange}
                      />

                      <TextField
                        id="link"
                        type={"text"}
                        label={t("form_vendor_link")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={vendorData?.link}
                        onChange={handleChange}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            </>
          )}
          <button
            // type="submit"
            // size="medium"
            style={{
              color: "white",
              fontFamily: fontFam,
            }}
            className={`${
              currentMode === "dark"
                ? "bg-primary-dark-neu"
                : "bg-primary-light-neu"
            } w-full text-white p-3 font-semibold uppercase mb-5`}
            onClick={AddTransaction}
            disabled={btnloading ? true : false}
          >
            {btnloading ? (
              <CircularProgress
                size={23}
                sx={{ color: "white" }}
                className="text-white"
              />
            ) : (
              <span>{edit ? t("update_vendor") : t("btn_add")}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddVendor;
