import React, { useEffect, useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Box,
} from "@mui/material";
import Select from "react-select";
import {
  claim,
  commission_type,
  payment_source,
  payment_status,
} from "../../Components/_elements/SelectOptions";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

import { MdClose, MdFileUpload } from "react-icons/md";
import { selectStyles } from "../../Components/_elements/SelectStyles";

import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import moment from "moment";

const AddCommissionModal = ({
  addCommissionModal,
  handleCloseAddCommission,
  Feedback,
}) => {
  console.log("Booked Form: ", addCommissionModal);
  console.log("Booked Data: ", Feedback);
  const token = localStorage.getItem("auth-token");
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
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [vendor, setVendor] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const [commissionData, setCommissionData] = useState({
    user_id: null,
    deal_id: addCommissionModal?.lid,
    vendor_id: null,
    invoice_type: null,
    date: null,
    amount: null,
    vat: null,
    status: null,
    comm_percent: null,
    claim: null,
    comm_amount: null,
    paid_by: null,
    image: null,
  });

  console.log("commission data:: ", commissionData);

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("files:: ", file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);

      const base64Image = reader.result;
      setCommissionData({
        ...commissionData,
        image: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const id = e.target.id;

    setCommissionData({
      ...commissionData,
      [id]: value,
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseAddCommission();
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const fetchVendors = async () => {
    setLoading(true);

    try {
      const vendorsList = await axios.get(`${BACKEND_URL}/vendors`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("vendors history::: ", vendorsList);

      setVendor(vendorsList?.data?.data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

      toast.error("Unable to fetch the vendors", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      handleClose();
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  //   const AddNote = (note = "") => {
  //     setaddNoteloading(true);
  //     const token = localStorage.getItem("auth-token");

  //     const data = {
  //       leadId: LeadData.leadId || LeadData.id,
  //       leadNote: note || AddNoteTxt,
  //       addedBy: User?.id,
  //       addedByName: User?.userName,
  //     };
  //     axios
  //       .post(`${BACKEND_URL}/leadNotes`, data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       })
  //       .then((result) => {
  //         console.log("Result: ");
  //         console.log("Result: ", result);
  //         setaddNoteloading(false);
  //         setAddNoteTxt("");
  //         if (!note) {
  //           toast.success("Note added Successfully", {
  //             position: "top-right",
  //             autoClose: 3000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "light",
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         setaddNoteloading(false);
  //         console.log(err);
  //         toast.error("Soemthing Went Wrong! Please Try Again", {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         });
  //       });
  //   };

  return (
    <Modal
      keepMounted
      open={addCommissionModal}
      // onClose={handleCloseAddCommission}
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
              <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="w-full flex items-center pb-3 ">
                  <div
                    className={`${
                      isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                    } bg-primary h-10 w-1 rounded-full my-1`}
                  ></div>
                  <h1
                    className={`text-lg font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    <h1 className="font-semibold pt-3 text-lg text-center">
                      {t("commission_details")}
                    </h1>
                  </h1>
                </div>
              </div>

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                {/* Commission DETAILS  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("commission_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
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
                    >
                      <Select
                        options={commission_type(t)?.map((comm_type) => ({
                          value: comm_type?.value,
                          label: comm_type?.label,
                        }))}
                        value={commission_type(t)?.filter(
                          (comm) => comm?.value === commissionData?.invoice_type
                        )}
                        onChange={(e) => {
                          setCommissionData({
                            ...commissionData,
                            invoice_type: e.value,
                          });
                        }}
                        placeholder={t("commission_type")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                        required
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={commissionData?.date}
                          label={t("booking_date")}
                          views={["month", "year"]}
                          onChange={(newValue) => {
                            const formattedDate = moment(newValue?.$d).format(
                              "YYYY-MM-DD"
                            );

                            setCommissionData((prev) => ({
                              ...prev,
                              date: formattedDate,
                            }));
                          }}
                          format="MM-YYYY"
                          renderInput={(params) => (
                            <TextField
                              sx={{
                                "& input": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                "& .MuiSvgIcon-root": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                marginBottom: "15px",
                              }}
                              fullWidth
                              size="small"
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                            />
                          )}
                          maxDate={dayjs().startOf("day").toDate()}
                        />
                      </LocalizationProvider>
                      <Select
                        options={claim(t)?.map((claim) => ({
                          value: claim.value,
                          label: claim.label,
                        }))}
                        value={claim(t)?.filter(
                          (claim) => claim?.value === commissionData?.claim
                        )}
                        onChange={(e) => {
                          setCommissionData({
                            ...commissionData,
                            claim: e.value,
                          });
                        }}
                        placeholder={t("claim")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      <TextField
                        id="comm_percent"
                        type={"text"}
                        label={t("commission_perc")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commissionData?.comm_percent}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        id="comm_amount"
                        type={"text"}
                        label={t("commission_amount")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commissionData?.comm_amount}
                        onChange={handleChange}
                        required
                      />
                    </Box>
                  </div>
                </div>

                {/* Payment DETAILS  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("booking_details")?.toUpperCase()}
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
                        id="Manager"
                        options={payment_status(t)?.map((status) => ({
                          value: status?.value,
                          label: status?.label,
                        }))}
                        value={payment_status(t)?.filter(
                          (status) => status?.value === commissionData?.status
                        )}
                        onChange={(e) => {
                          setCommissionData({
                            ...commissionData,
                            status: e.value,
                          });
                        }}
                        placeholder={t("status")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      <Select
                        id="Manager"
                        options={payment_source(t)?.map((payment) => ({
                          value: payment.value,
                          label: payment.label,
                        }))}
                        value={payment_source(t)?.filter(
                          (pay_src) =>
                            pay_src?.value === commissionData?.paid_by
                        )}
                        onChange={(e) => {
                          setCommissionData({
                            ...commissionData,
                            paid_by: e.value,
                          });
                        }}
                        placeholder={t("payment_source")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      <Select
                        id="Manager"
                        options={vendor?.map((vendor) => ({
                          value: vendor.id,
                          label: vendor.vendor_name,
                        }))}
                        value={vendor?.filter(
                          (ven) => ven?.id === commissionData?.vendor_id
                        )}
                        onChange={(e) => {
                          console.log(" vendor: ", e);
                          setCommissionData({
                            ...commissionData,
                            vendor_id: e.value,
                          });
                        }}
                        placeholder={t("vendor")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      <TextField
                        id="vat"
                        type={"text"}
                        label={t("vat_amount")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commissionData?.vat}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        id="amount"
                        type={"text"}
                        label={t("total_amount")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commissionData?.amount}
                        onChange={handleChange}
                        required
                      />
                    </Box>
                  </div>
                </div>

                {/* Eivdence  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("evidence")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box sx={darkModeColors} className="p-2">
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
                          <span>{t("upload_invoice")}</span>
                        </Button>
                      </label>
                    </Box>
                  </div>
                </div>
              </div>
            </>
          )}
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
              <span>{t("save")}</span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCommissionModal;
