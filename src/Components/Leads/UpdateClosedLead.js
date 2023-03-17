import { Button } from "@material-tailwind/react";
import { Backdrop, CircularProgress, Modal, TextField, IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";

const UpdateLead = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  FetchLeads,
  LeadData,
}) => {
  // eslint-disable-next-line
  const { darkModeColors, currentMode, User, BACKEND_URL } = useStateContext();
  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
  const style = {
    transform: "translate(-50%, -50%)",
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

  // eslint-disable-next-line
  const ChangeLeadStatus = (event) => {
    setLeadStatus(event.target.value);
  };
  // eslint-disable-next-line
  const ChangeFeedback = (event) => {
    setFeedback(event.target.value);
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
        // setlead(result?.data?.data);

        if (result.data.status) {
          const { amount, dealDate } = result.data.closeddeals;
          setLeadDateValue(dayjs(dealDate));
          setLeadAmount(amount);
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
        console.log(err);
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

  const UpdateLeadFunc = async () => {
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("id", User.id);
    UpdateLeadData.append("amount", leadAmount);
    UpdateLeadData.append("dealDate", leadDate);

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
          style={style}
          className={`w-[calc(100%-20px)] sm:w-[85%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
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
              <span className="font-semibold text-lg"> Fetching Your Lead</span>
            </div>
          ) : (
            <>
              <h1
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-center font-bold text-xl pb-10`}
              >
                Update lead details
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  UpdateLeadFunc();
                }}
              >
                <div className="grid sm:grid-cols-1 gap-5">
                  <div className="flex flex-col justify-center items-center gap-4 mt-2 mb-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Closed Deal Date"
                        value={leadDateValue}
                        views={["year", "month", "day"]}
                        required
                        onChange={(newValue) => {
                          setLeadDateValue(newValue);
                          setLeadDate(
                            format(newValue.$d.getUTCFullYear()) +
                              "-" +
                              format(newValue.$d.getUTCMonth() + 1) +
                              "-" +
                              format(newValue.$d.getUTCDate() + 1)
                          );
                        }}
                        format="yyyy-MM-dd"
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                    <TextField
                      required
                      fullWidth
                      label="Closed Deal Amount"
                      value={leadAmount}
                      onChange={(e) => {
                        setLeadAmount(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
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
                    <span> Update Lead</span>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default UpdateLead;
