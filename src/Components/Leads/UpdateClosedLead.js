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
import { MdClose } from "react-icons/md";

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
  } = useStateContext();
  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
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
  const [isClosing, setIsClosing] = useState(false);

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
            } ${isLangRTL(i18n.language) ? "border-r-2" : "border-l-2"}
             p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
            `}
          >
            <IconButton
              sx={{
                position: "absolute",
                right: 12,
                top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={handleLeadModelClose}
            >
              <IoMdClose size={18} />
            </IconButton>
            {loading ? (
              <div className="w-full flex items-center justify-center space-x-1">
                <CircularProgress size={20} />
                <span className="font-semibold text-lg">
                  {t("fetching_your_lead")}
                </span>
              </div>
            ) : (
              <>
                <h1
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-black"
                  } text-center font-bold text-lg pb-10`}
                >
                  {t("update_closed_details")}
                </h1>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateLeadFunc();
                  }}
                >
                  <div className="grid sm:grid-cols-1">
                    <div className="flex flex-col justify-center items-center gap-7 mb-5">
                      <Box sx={darkModeColors} className="w-full">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={t("closed_deal_date")}
                            value={leadDateValue}
                            views={["year", "month", "day"]}
                            required
                            onChange={(newValue) => {
                              setLeadDateValue(newValue);
                              console.log("newvalue: ", newValue);
                              setLeadDate(
                                formatNum(newValue.$d.getUTCFullYear()) +
                                  "-" +
                                  formatNum(newValue.$d.getUTCMonth() + 1) +
                                  "-" +
                                  formatNum(newValue.$d.getUTCDate() + 1)
                              );
                            }}
                            format="yyyy-MM-dd"
                            // renderInput={(params) => (
                            //   <TextField {...params} fullWidth />
                            // )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onKeyDown={(e) => e.preventDefault()}
                                readOnly={true}
                                fullWidth
                                size="small"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Box>
                      <Box sx={darkModeColors} className="w-full">
                        <TextField
                          required
                          fullWidth
                          label={t("closed_amount")}
                          value={leadAmount}
                          size="small"
                          onChange={(e) => {
                            setLeadAmount(e.target.value);
                          }}
                        />
                      </Box>
                      <Box sx={darkModeColors} className="w-full">
                        <TextField
                          required
                          fullWidth
                          label={t("label_unit")}
                          value={unitNo}
                          size="small"
                          onChange={(e) => {
                            setUnitNo(e.target.value);
                          }}
                        />
                      </Box>
                    </div>
                  </div>

                  <Button
                    className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
                    ripple={true}
                    size="lg"
                    type="submit"
                    disabled={btnloading ? true : false}
                  >
                    {btnloading ? (
                      <div className="flex items-center justify-center space-x-1">
                        <CircularProgress size={18} sx={{ color: "white" }} />
                      </div>
                    ) : (
                      <span> {t("btn_update_lead")}</span>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateLead;
