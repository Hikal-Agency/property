import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
  Box,
} from "@mui/material";

import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";
import { MdClose, MdFileUpload } from "react-icons/md";
import { selectStyles } from "../_elements/SelectStyles";
import Select from "react-select";
import { currencies } from "../_elements/SelectOptions";
import usePermission from "../../utils/usePermission";

const UpdateLead = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  FetchLeads,
  LeadData,
}) => {
  // eslint-disable-next-line
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    formatNum,
    t,
    isLangRTL,
    i18n,
    fontFam,
    isArabic,
    primaryColor,
  } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);
  const { hasPermission } = usePermission();

  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
  // const style = {
  //   transform: "translate(-50%, -50%)",
  //   boxShadow: 24,
  // };
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };
  //eslint-disable-next-line
  const [PropertyType, setPropertyType] = useState("");
  //eslint-disable-next-line
  const [EnquiryType, setEnquiryType] = useState("");
  //eslint-disable-next-line
  const [ForType, setForType] = useState("");
  //eslint-disable-next-line
  const [LanguagePrefered, setLanguagePrefered] = useState("");
  //eslint-disable-next-line
  const [LeadStatus, setLeadStatus] = useState("");
  // eslint-disable-next-line
  const [Feedback, setFeedback] = useState("");
  //eslint-disable-next-line
  const [Manager, setManager] = useState("");
  const [Manager2, setManager2] = useState([]);
  //eslint-disable-next-line
  const [SalesPerson, setSalesPerson] = useState([]);
  //eslint-disable-next-line
  const [SalesPerson2, setSalesPerson2] = useState("");
  //eslint-disable-next-line
  const [LeadName, setLeadName] = useState("");
  const [leadDate, setLeadDate] = useState("");
  const [leadDateValue, setLeadDateValue] = useState({});
  const [leadAmount, setLeadAmount] = useState("");
  const [unitNo, setUnitNo] = useState("");

  // eslint-disable-next-line
  const ChangeLeadStatus = (event) => {
    setLeadStatus(event.target.value);
  };
  // eslint-disable-next-line
  const ChangeFeedback = (event) => {
    setFeedback(event.target.value);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleLeadModelClose();
    }, 1000);
  };
  useEffect(() => {
    console.log("lead data is ");
    console.log(LeadData);
    const token = localStorage.getItem("auth-token");

    axios
      .get(`${BACKEND_URL}/teamMembers/${User.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        // console.log(result);
        setManager2(result.data.team);
      })
      .catch((err) => {
        console.log(err);
      });

    // GETTING LEAD DETAILS
    axios
      .post(
        `${BACKEND_URL}/editdeal/${LeadData.lid}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("the lead details is given by");
        console.log(result);

        if (result.data.status) {
          const { amount, dealDate, unit } = result.data.closeddeals;
          setLeadDateValue(dayjs(dealDate));
          setLeadAmount(amount);
          setUnitNo(unit);
        } else {
          toast.error("Error in Fetching the Lead", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          handleLeadModelClose();
        }
        setloading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error in Fetching the Lead", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleLeadModelClose();
      });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // console.log("manager hook is calling");
    // console.log(Manager2);
    // console.log(Manager);
    const SalesPersons = Manager2.filter(function (el) {
      return el.uid === parseInt(Manager);
    });
    // console.log(SalesPersons);
    setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
    // eslint-disable-next-line
  }, [Manager]);

  console.log("leadDate:: ", leadDate);

  const UpdateLeadFunc = async () => {
    console.log("leadDate:: ", leadDate);

    let date = leadDate;
    if (!leadDate) {
      date = LeadData?.dealDate;
    }

    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("id", User.id);
    // const updateLeadDate = dayjs(leadDate).format("YYYY-MM-DD");
    const updateLeadDate = dayjs(date).format("YYYY-MM-DD");
    UpdateLeadData.append("amount", leadAmount);
    UpdateLeadData.append("dealDate", updateLeadDate);
    UpdateLeadData.append("unit", unitNo);

    await axios
      .post(`${BACKEND_URL}/editdeal/${LeadData.lid}`, UpdateLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("lead updated successfull");
        console.log(result);
        toast.success("Lead Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        FetchLeads(token);
        setbtnloading(false);
        handleLeadModelClose();
      })
      .catch((err) => {
        toast.error("Error in Updating the Lead", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
      });
  };

  function format(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }
  return (
    <>
      {/* MODAL FOR SINGLE LEAD SHOW */}
      <Modal
        keepMounted
        open={LeadModelOpen}
        onClose={handleLeadModelClose}
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
                      style={{
                        fontFamily: isArabic(Feedback?.feedback)
                          ? "Noto Kufi Arabic"
                          : "inherit",
                      }}
                    ></h1>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                  {/* Project DETAILS  */}
                  <div
                    className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                  >
                    <h1 className="text-center uppercase font-semibold">
                      {t("project_details")?.toUpperCase()}
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
                        <TextField
                          id="project_name"
                          type={"text"}
                          label={t("label_project_name")}
                          className="w-full"
                          sx={{
                            "&": {
                              marginBottom: "1.25rem !important",
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={Feedback?.project}
                          //   onChange={(e) => setLeadNotes(e.target.value)}
                          required
                        />
                        <TextField
                          id="project_name"
                          type={"text"}
                          label={t("label_enquiry_for")}
                          className="w-full"
                          sx={{
                            "&": {
                              marginBottom: "1.25rem !important",
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={Feedback?.enquiryType}
                          //   onChange={(e) => setLeadNotes(e.target.value)}
                          required
                        />
                        <TextField
                          id="selling_amount"
                          type={"text"}
                          label={t("selling_amount")}
                          className="w-full"
                          sx={{
                            "&": {
                              marginBottom: "1.25rem !important",
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={Feedback?.enquiryType}
                          //   onChange={(e) => setLeadNotes(e.target.value)}
                          required
                        />
                        <TextField
                          id="unit"
                          type={"text"}
                          label={t("unit")}
                          className="w-full"
                          sx={{
                            "&": {
                              marginBottom: "1.25rem !important",
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          // value={Feedback?.enquiryType}
                          //   onChange={(e) => setLeadNotes(e.target.value)}
                          required
                        />
                        <Select
                          id="Manager"
                          options={currencies(t)?.map((curr) => ({
                            value: curr.value,
                            label: curr.label,
                          }))}
                          value={null}
                          //   onChange={ChangeManager}
                          placeholder={t("label_select_currency")}
                          className={`mb-5`}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            //   value={reportMonthValue || new Date()?.toString()}
                            label={t("deal_date")}
                            views={["month", "year"]}
                            //   onChange={(newValue) => {
                            //     if (newValue) {
                            //       // Extract the month digit
                            //       const monthDigit = moment(newValue.$d).format(
                            //         "M"
                            //       );

                            //       // Convert the month digit string to an integer
                            //       const monthDigitInt = parseInt(monthDigit, 10);
                            //       console.log(
                            //         "month digit int :: ",
                            //         typeof monthDigitInt
                            //       );

                            //       // Extract the year
                            //       const year = moment(newValue.$d).format("YYYY");

                            //       // Set the report month digit as an integer and the year
                            //       setReportMonth({
                            //         month: monthDigitInt,
                            //         year: parseInt(year, 10),
                            //       });
                            //     }
                            //     console.log("val:", newValue);

                            //     setReportMonthValue(newValue?.$d);
                            //   }}
                            format="MM-YYYY"
                            renderInput={(params) => (
                              <TextField
                                sx={{
                                  "& input": {
                                    color:
                                      currentMode === "dark"
                                        ? "white"
                                        : "black",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    color:
                                      currentMode === "dark"
                                        ? "white"
                                        : "black",
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
                      </Box>
                    </div>
                  </div>

                  {/* COMMISSION DETAILS  */}
                  {hasPermission("deal_commission") && (
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
                            // marginTop:"20p"
                          }}
                        >
                          <TextField
                            id="project_name"
                            type={"text"}
                            label={t("total_commission")}
                            className="w-full"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            // value={Feedback?.enquiryType}
                            //   onChange={(e) => setLeadNotes(e.target.value)}
                            required
                          />

                          <TextField
                            id="booking_amount"
                            type={"text"}
                            label={t("total_commission_amount")}
                            className="w-full"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={Feedback?.enquiryType}
                            //   onChange={(e) => setLeadNotes(e.target.value)}
                            required
                          />

                          <TextField
                            id="booking_amount"
                            type={"text"}
                            label={t("vat_perc")}
                            className="w-full"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={Feedback?.enquiryType}
                            //   onChange={(e) => setLeadNotes(e.target.value)}
                            required
                          />

                          <TextField
                            id="booking_amount"
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
                            value={Feedback?.enquiryType}
                            //   onChange={(e) => setLeadNotes(e.target.value)}
                            required
                          />

                          <TextField
                            id="booking_amount"
                            type={"text"}
                            label={t("agent_comm_perc")}
                            className="w-full"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={Feedback?.enquiryType}
                            //   onChange={(e) => setLeadNotes(e.target.value)}
                            required
                          />

                          <TextField
                            id="booking_amount"
                            type={"text"}
                            label={t("agent_comm_amount")}
                            className="w-full"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={Feedback?.enquiryType}
                            //   onChange={(e) => setLeadNotes(e.target.value)}
                            required
                          />
                        </Box>
                      </div>
                    </div>
                  )}

                  {/* CLIENT  DETAILS  */}
                  <div
                    className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                  >
                    <h1 className="text-center uppercase font-semibold">
                      {t("client_details")?.toUpperCase()}
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
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
                              //   src={imagePreview}
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
                            <span>{t("label_passport_image")}</span>
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
                <span>{t("update")}</span>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateLead;
