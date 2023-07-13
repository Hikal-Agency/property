import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useStateContext } from "../../context/ContextProvider";
// import axios from "axios";
import axios from "../../axoisConfig";
import { ToastContainer, toast } from "react-toastify";
import {
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Select } from "@mui/base";

const Contacts = () => {
  const { currentMode, BACKEND_URL, Managers, SalesPerson } = useStateContext();
  const [loading, setloading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [selectedPhoneNoVal, setSelectedPhoneNoVal] = useState("");
  const [selectedEmailVal, setSelectedEmailVal] = useState("");
  const [phoneStatusSelected, setPhoneStatusSelected] = useState("0");
  const [phoneTypeSelected, setPhoneTypeSelected] = useState("0");
  const [Manager, setManager] = useState("0");
  const [SalesPerson2, setSalesPerson2] = useState("0");

  const handleRadioChange = (event, input) => {
    if (input === "phone") {
      setSelectedPhoneNoVal(event.target.value);
    } else if (input === "email") {
      setSelectedEmailVal(event.target.value);
    }
  };

  //eslint-disable-next-line
  const ContactData = [
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
  ];

  const handlePageChange = (event, value) => {
    setPage(value);
    // FetchContacts(token);
  };
  const FetchContacts = async (token) => {
    setloading(true);
    await axios
      .get(`${BACKEND_URL}/users?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("The data has contact", result.data);
        console.log(
          "The data has contact max page",
          result.data.managers.last_page
        );

        setContacts(result.data.managers.data);
        setMaxPage(result.data.managers.last_page);
        setTimeout(() => {
          setloading(false);
        }, 500);
      })
      .catch((err) => {
        toast.error("Sorry something went wrong. Kindly refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // navigate("/", {
        //   state: {
        //     error: "Something Went Wrong! Please Try Again",
        //     continueURL: location.pathname,
        //   },
        // });
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchContacts(token);
  }, [page]);
  return (
    <>
      <ToastContainer />
      {/* <Head>
        <title>HIKAL CRM - Leaderboard</title>
        <meta name="description" content="Leaderboard - HIKAL CRM" />
      </Head> */}
      <div className="min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="pl-3">
              <div className="mt-5 md:mt-2">
                <h1
                  className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 mt-4 font-bold ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-main-red-color font-bold border-main-red-color"
                  }`}
                >
                Contacts
                </h1>

                <Box
                  sx={{
                    "& .MuiFormGroup-root": {
                      flexDirection: "row !important",
                    },
                    "& .MuiFormControlLabel-label": {
                      color: "grey",
                      fontSize: 15,
                    },
                    "& .filter-label": {
                      width: 120,
                    },
                    "& > div > .flex": {
                      borderBottom: "1px solid #80808024",
                      marginBottom: "10px",
                      paddingBottom: "6px",
                    },
                  }}
                  className="flex"
                >
                  <div className="w-[30%] h-full p-3 border rounded mr-3">
                    <strong className="mb-3 text-red-600">Filters</strong>
                    <div className="flex mt-4 items-center">

                      <div class="flex items-center">
                        <div className="h-[12px] bg-[#da1f26a3] w-[12px] mr-2">
                          </div>
                        <p className="filter-label">Phone No</p>
                      </div>
                      <RadioGroup
                        className="flex items-center ml-4"
                        value={selectedPhoneNoVal}
                        onChange={(e) => handleRadioChange(e, "phone")}
                      >
                        <FormControlLabel
                          value="with"
                          control={<Radio size="16" />}
                          label="With"
                        />
                        <FormControlLabel
                          value="without"
                          control={<Radio size="16" />}
                          label="Without"
                        />
                      </RadioGroup>
                    </div>
                    <div className="flex items-center">
                      
                      <div class="flex items-center">
                        <div className="h-[12px] bg-[#da1f26a3] w-[12px] mr-2">
                          </div>
                        <p className="filter-label">Email Address</p>
                      </div>
                      <RadioGroup
                        className="flex items-center ml-4"
                        value={selectedEmailVal}
                        onChange={(e) => handleRadioChange(e, "email")}
                      >
                        <FormControlLabel
                          value="with"
                          control={<Radio size="16" />}
                          label="With"
                        />
                        <FormControlLabel
                          value="without"
                          control={<Radio size="16" />}
                          label="Without"
                        />
                      </RadioGroup>
                    </div>
                    <div class="flex items-center">
                      
                      <div class="flex items-center">
                        <div className="h-[12px] bg-[#da1f26a3] w-[12px] mr-2">
                          </div>
                        <p className="filter-label">Phone Status</p>
                      </div>
                      <TextField
                        select
                        id="phoneStatus"
                        size="small"
                        onChange={(e) => setPhoneStatusSelected(e.target.value)}
                        value={phoneStatusSelected}
                        displayEmpty
                        fullWidth
                      >
                        <MenuItem selected value="0">
                          Select Status
                        </MenuItem>
                        <MenuItem value="valid">Valid</MenuItem>
                        <MenuItem value="invalid">Invalid</MenuItem>
                      </TextField>
                    </div>
                    <div class="flex items-center">
                      
                      <div class="flex items-center">
                        <div className="h-[12px] bg-[#da1f26a3] w-[12px] mr-2">
                          </div>
                        <p className="filter-label">Phone Type</p>
                      </div>
                      <TextField
                        select
                        id="phoneType"
                        size="small"
                        onChange={(e) => setPhoneTypeSelected(e.target.value)}
                        value={phoneTypeSelected}
                        className="w-full"
                        displayEmpty
                      >
                        <MenuItem selected value="0">
                          Select Type
                        </MenuItem>
                        <MenuItem value="mobile">Mobile</MenuItem>
                        <MenuItem value="landline">Landline</MenuItem>
                      </TextField>
                    </div>
                    <div className="flex items-center">

                      <div class="flex items-center">
                        <div className="h-[12px] bg-[#da1f26a3] w-[12px] mr-2">
                          </div>
                        <p className="filter-label">Manager</p>
                      </div>
                      <TextField
                        id="Manager"
                        select
                        value={Manager}
                        onChange={(e) => setManager(e.target.value)}
                        size="small"
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="0">Select Manager</MenuItem>

                        {Managers?.map((person, index) => (
                          <MenuItem key={index} value={person?.id}>
                            {person?.userName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="flex items-center">
                      
                      <div class="flex items-center">
                        <div className="h-[12px] bg-[#da1f26a3] w-[12px] mr-2">
                          </div>
                        <p className="filter-label">Salesperson</p>
                      </div>
                      <TextField
                        select
                        id="SalesPerson"
                        value={SalesPerson2}
                        onChange={(e) => setSalesPerson2(e.target.value)}
                        size="small"
                        className="w-full"
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="0">Select Agent</MenuItem>
                        {SalesPerson[`manager-${Manager}`]?.map(
                          (agent, index) => (
                            <MenuItem key={index} value={agent?.id}>
                              {agent?.userName}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    </div>
                  </div>
                  <div className="grid w-full flex-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                    {contacts?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            currentMode === "dark"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-200 text-black"
                          } p-3 rounded-md `}
                        >
                          {item?.profile_picture ? (
                            <img
                              src={`${item?.profile_picture}`}
                              className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
                              alt=""
                            />
                          ) : (
                            <img
                              src="/favicon.png"
                              className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
                              alt=""
                            />
                          )}
                          <div className="mt-2 space-y-1 overflow-hidden">
                            <h1 className="font-bold capitalize">
                              {item.userName}
                            </h1>
                            <p className="text-sm capitalize">
                              {item.position}
                            </p>
                            {/* <p className="text-sm font-semibold text-red-600">
                              {item.userName}
                            </p> */}
                            <p className="text-sm">{item.userPhone}</p>
                            <p className="text-sm">{item.userEmail}</p>
                            <p className="text-sm">{item.userContact}</p>
                            {item?.status === 0 ? (
                              <p className="text-sm text-red-600">Deactive</p>
                            ) : (
                              <p className="text-sm text-green-600">Active</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Box>
              </div>
            </div>

            <Stack spacing={2} marginTop={2}>
              <Pagination
                page={page}
                count={maxPage}
                color={currentMode === "dark" ? "primary" : "secondary"}
                onChange={handlePageChange}
                style={{ margin: "auto", marginBottom: "10px" }}
                sx={{
                  "& .Mui-selected": {
                    color: "white !important",
                    backgroundColor: "#DA1F26 !important",
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: currentMode === "dark" ? "white" : "black",
                  },
                }}
              />
            </Stack>
          </div>
        )}
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Contacts;
