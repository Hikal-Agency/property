import { Button } from "@material-tailwind/react";
// import axios from "axios";
import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ImagePicker from "../../Pages/profile/ImagePicker";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Select, MenuItem } from "@mui/material";
import moment from "moment";

const SingleEmployee = ({ user }) => {
  const path = window.location.pathname;
  const id = path.split("/").pop();

  console.log("id: ", id);
  console.log("user: ", user);

  const [loading, setloading] = useState(true);
  const {
    User,
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    setUser,
    DataGridStyles,
    pageState,
    setpageState,
  } = useStateContext();
  const [GeneralInfoData, setGeneralInfo] = useState({
    userAltContact: "",
    userAltEmail: "",
    userEmail: "",
    userContact: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const [PersonalInfo, setPersonalInfo] = useState({});
  const navigate = useNavigate();
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [empData, setEmpData] = useState(null);

  console.log("emp data: ", empData);

  const columns = [
    { field: "id", headerAlign: "center", headerName: "ID", minWidth: 60 },
    {
      field: "time",
      headerAlign: "center",
      headerName: "Time",
      minWidth: 120,
      renderCell: (cellValues) => {
        return (
          <div>{moment(cellValues.row.check_datetime).format("h:mm:ss A")}</div>
        );
      },
    },
    {
      field: "check_datetime",
      headerAlign: "center",
      headerName: "Date",
      minWidth: 120,
      renderCell: (cellValues) => {
        return (
          <div>
            {moment(cellValues.row.check_datetime).format("YYYY-MM-DD")}
          </div>
        );
      },
    },
    {
      field: "day",
      headerAlign: "center",
      headerName: "Day",
      minWidth: 120,
      renderCell: (cellValues) => {
        return (
          <div>{moment(cellValues.row.check_datetime).format("dddd")}</div>
        );
      },
    },

    // {
    //   field: "checkIn",
    //   headerAlign: "center",
    //   headerName: "Check-In",
    //   minWidth: 100,
    // },
    {
      field: "attendance_type",
      headerAlign: "center",
      headerName: "Check-Out",
      minWidth: 120,
    },
    {
      field: "status",
      headerAlign: "center",
      headerName: "Status",
      minWidth: 120,
    },
    {
      field: "late_minutes",
      headerAlign: "center",
      headerName: "Late By",
      minWidth: 120,
    },
    {
      field: "late_reason",
      headerAlign: "center",
      headerName: "Reason",
      minWidth: 250,
    },
    {
      field: "salary",
      headerAlign: "center",
      headerName: "Salary",
      minWidth: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: "100%",
      // minWidth: 120,
      renderCell: (params) => (
        <>
          <IconButton>
            <MdModeEdit />
          </IconButton>
          <IconButton>
            <MdDelete />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      day: "Monday",
      date: "2023-05-01",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      status: "Present",
      lateBy: "0 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 2,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 3,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 4,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 5,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 5,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 5,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 5,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 5,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
    {
      id: 5,
      day: "Tuesday",
      date: "2023-05-02",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      status: "Present",
      lateBy: "5 minutes",
      reason: "N/A",
      salary: "$2000",
    },
  ];

  const generateLastThreeMonths = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const months = [];

    for (let i = 0; i < 3; i++) {
      const monthIndex = currentMonth - i;
      const month = new Date(currentDate.getFullYear(), monthIndex);
      const monthLabel = month.toLocaleString("en-US", { month: "long" });
      months.push({ value: monthIndex, label: monthLabel });
    }

    return months;
  };
  const lastThreeMonths = generateLastThreeMonths();

  // Btn loading
  const [btnloading, setbtnloading] = useState(false);

  // COUNTER FOR TABS
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const SetUserProfilePic = (url) => {
    setUser((user) => ({
      ...user,
      displayImg: url,
    }));
    const localStorageUser = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...localStorageUser,
        displayImg: url,
      })
    );
  };

  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/attendance?user_id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("fetched data ", result.data);

        const data = result.data.Record.data;

        let rowsdata = data?.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          attendance_type: row?.attendance_type,
          check_datetime: row?.check_datetime,
          default_datetime: row?.default_datetime,
          attendance_source: row?.attendance_source || "-",
          is_late: row?.is_late || "-",
          late_reason: row?.late_reason || "-",
          late_minutes: row?.late_minutes || "-",
          salary: row?.salary || "-",
          profile_picture: row?.profile_picture || "-",
          position: row?.position || "-",
          currency: row?.currency || "-",
          userName: row?.userName || "-",
          created_at: row?.created_at,
          updated_at: row?.updated_at,
          edit: "edit",
        }));

        setEmpData(rowsdata);
        setloading(false);

        setpageState((old) => ({
          ...old,
          data: rowsdata,
        }));
      })
      .catch((err) => {
        setloading(false);
        console.log("here is error");
        console.log(err);
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
    setopenBackDrop(false);
    const token = localStorage.getItem("auth-token");
    FetchProfile(token);
    // eslint-disable-next-line
  }, []);

  // const UpdateProfile = async (data) => {
  //   console.log("Profile: ", data);
  //   if (data?.userAltEmail) {
  //     console.log("email: ", data?.userAltEmail);

  //     const onlyLetters = /^[A-Za-z]*$/;
  //     if (!onlyLetters.test(data?.userAltEmail)) {
  //       return;
  //     }
  //   }
  //   setbtnloading(true);
  //   const token = localStorage.getItem("auth-token");
  //   await axios
  //     .post(`${BACKEND_URL}/updateuser/${User.id}`, JSON.stringify(data), {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     })
  //     .then((result) => {
  //       console.log("Profile Updated successfull");
  //       console.log(result);
  //       toast.success("Profile Updated Successfully", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //       const token = localStorage.getItem("auth-token");
  //       if (token) {
  //         FetchProfile(token);
  //       } else {
  //         navigate("/", {
  //           state: { error: "Something Went Wrong! Please Try Again" },
  //         });
  //       }
  //       setbtnloading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error("Error in Updating Profile", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //       setbtnloading(false);
  //     });
  // };

  // const handlePickImage = (event) => {
  //   const reader = new FileReader();
  //   const file = event.target.files[0];
  //   console.log("file: ", file);
  //   reader.onloadend = () => {
  //     setSelectedImage(reader?.result);
  //     console.log("onload: ", file);
  //   };
  //   // reader.readAsDataURL(file);

  //   reader?.readAsDataURL(new Blob([file], { type: file.type.slice(6) }));

  //   console.log("reader: ", reader);
  //   console.log("reader result: ", reader.result);
  //   console.log("Uploaded image: ", selectedImage);
  // };

  // const handlePickImage = (event) => {
  //   console.log(event);
  //   if (event.target && event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     console.log("file: ", file);
  //     setSelectedImage((imageFile) => file);
  //     console.log("Select: ", selectedImage);

  //     if (file.type.startsWith("image/")) {
  //       // setSelectedImage(file);
  //       console.log("selected IMAGE: ", selectedImage);
  //     } else {
  //       console.log("Invalid file type: ", file.type);
  //     }
  //   } else {
  //     console.log("No file selected");
  //   }
  //   console.log("selected image: ", selectedImage);
  // };

  const UpdateProfile = async (data) => {
    console.log("Profile: ", data);

    // if (data?.userAltEmail) {
    //   // check if data contains userAltEmail
    //   console.log("email: ", data?.userAltEmail);

    //   const emailRegex = /^\S+@\S+\.\S+$/;
    //   if (!emailRegex.test(data?.userAltEmail)) {
    //     return;
    //   }
    // }

    // if (data?.userAltEmail) {
    //   // check if data contains userAltEmail
    //   console.log("email is here: ", data?.userAltEmail);

    //   // regex for validating the username
    //   const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]$/;
    //   // regex for validating the domain name
    //   const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
    //   // regex for validating the TLD
    //   const tldRegex = /^[a-zA-Z]+$/;

    //   const parts = data.userAltEmail.split("@");
    //   if (parts.length !== 2) {
    //     // the email address must contain one "@" symbol

    //     return;
    //   }

    //   const username = parts[0];
    //   const domain = parts[1].split(".");
    //   if (domain.length < 2) {
    //     // the domain name must contain at least one "." symbol
    //     return;
    //   }

    //   const tld = domain[domain.length - 1];
    //   const domainName = domain.slice(0, domain.length - 1).join(".");

    //   if (
    //     !usernameRegex.test(username) ||
    //     !domainRegex.test(domainName) ||
    //     !tldRegex.test(tld)
    //   ) {
    //     console.log("Email is not valid");
    //     toast.error("Invalid Email", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //     return;
    //   }
    // }

    const validateEmail = (email) => {
      // regex for validating the username
      const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]$/;
      // regex for validating the domain name
      const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
      // regex for validating the TLD
      const tldRegex = /^[a-zA-Z]+$/;

      const parts = email.split("@");
      if (parts.length !== 2) {
        // the email address must contain one "@" symbol
        return false;
      }

      const username = parts[0];
      const domain = parts[1].split(".");
      if (domain.length < 2) {
        // the domain name must contain at least one "." symbol
        return false;
      }

      const tld = domain[domain.length - 1];
      const domainName = domain.slice(0, domain.length - 1).join(".");

      if (
        !usernameRegex.test(username) ||
        !domainRegex.test(domainName) ||
        !tldRegex.test(tld)
      ) {
        // the email address contains invalid characters
        return false;
      }

      return true;
    };

    if (data?.userAltEmail) {
      // check if data contains userAltEmail
      console.log("email is here: ", data?.userAltEmail);
      if (!validateEmail(data.userAltEmail)) {
        console.log("Email is not valid");
        toast.error("Invalid Alternate Email", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    if (data?.userEmail) {
      // check if data contains userEmail
      console.log("email is here: ", data?.userEmail);
      if (!validateEmail(data.userEmail)) {
        console.log("Email is not valid");
        toast.error("Invalid Email", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    await axios
      .post(`${BACKEND_URL}/updateuser/${User.id}`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Profile Updated successfull");
        console.log(result);
        toast.success("Profile Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        const token = localStorage.getItem("auth-token");
        if (token) {
          FetchProfile(token);
        } else {
          navigate("/", {
            state: { error: "Something Went Wrong! Please Try Again" },
          });
        }
        setbtnloading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Profile", {
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

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full `}>
              <div className="pl-3">
                <Box sx={darkModeColors}>
                  <div className="flex justify-end">
                    <Select
                      id="monthSelect"
                      size="small"
                      className="w-[100px]"
                      displayEmpty
                    >
                      <MenuItem selected>Select a month</MenuItem>
                      {lastThreeMonths?.map((month) => (
                        <MenuItem key={month?.value} value={month?.value}>
                          {month?.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </Box>
                <div className="my-5 mb-10">
                  <div
                    className={`grid grid-cols-8 ${
                      currentMode === "dark"
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900 "
                    } rounded-md shadow-md`}
                  >
                    <div className="col-span-2 border-r-2 border-gray-400  py-10 ">
                      {/* <h1 className="text-xl font-semibold pb-10 text-center">
                        User Account
                      </h1> */}
                      <label htmlFor="pick-image">
                        <div
                          // onClick={() => setImagePickerModal({ isOpen: true })}
                          className="relative"
                        >
                          <img
                            src={empData[0]?.profile_picture}
                            width={200}
                            height={200}
                            alt=""
                            className="rounded-full mx-auto w-28"
                          />
                        </div>
                      </label>

                      <div className="mb-3">
                        <h1 className="text-lg font-bold text-center">
                          {/* {User?.userName} */}
                          {empData[0]?.userName}
                        </h1>
                        <h3
                          className={`${
                            currentMode === "dark"
                              ? "text-gray-50"
                              : "text-gray-600"
                          }  text-center`}
                        >
                          {empData[0]?.position}
                        </h3>
                      </div>
                      <div className="accountinfo border-t-2 border-gray-400 px-5 pt-5 ">
                        <div className="flex justify-center flex-col items-center">
                          <div
                            className={`mt-1 text-center ${
                              currentMode === "dark"
                                ? "text-gray-50"
                                : "text-gray-600"
                            }`}
                          >
                            <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
                              {/* <MdEmail size={25} className="block" /> */}
                              <h1>Monthly Salary</h1>
                            </div>
                            {empData[0]?.salary
                              ? (empData[0]?.salary, empData[0]?.currency)
                              : "No data."}
                          </div>
                          <div
                            className={`mt-3 text-center ${
                              currentMode === "dark"
                                ? "text-gray-50"
                                : "text-gray-600"
                            }`}
                          >
                            <div className="flex items-center justify-center font-semibold mb-1">
                              <h1 className="block">Salary Per Day: </h1>{" "}
                              {/* <p className="font-bold">Active</p> */}
                            </div>
                            <div className="mt-3">
                              <h1>Profile Created on: </h1>
                              <p className="font-bold">{User?.creationDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="accountinfo border-t-2 border-gray-400 px-5 mt-3 pt-5 ">
                        <div className="flex justify-center flex-col items-center">
                          <div
                            className={`mt-1 text-center ${
                              currentMode === "dark"
                                ? "text-gray-50"
                                : "text-gray-600"
                            }`}
                          >
                            <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
                              <MdEmail size={25} className="block" />
                              <h1>Email Address</h1>
                            </div>
                            {User?.userEmail}
                          </div>
                          <div
                            className={`mt-3 text-center ${
                              currentMode === "dark"
                                ? "text-gray-50"
                                : "text-gray-600"
                            }`}
                          >
                            <div className="flex items-center justify-center font-semibold mb-1">
                              <h1 className="block">Status: </h1>{" "}
                              <p className="font-bold">Active</p>
                            </div>
                            <div className="mt-3">
                              <h1>Profile Created on: </h1>
                              <p className="font-bold">{User?.creationDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* section 2 */}
                    <div className="col-span-6 ">
                      <Box
                        width={"100%"}
                        height={"100%"}
                        className={`single-emp ${currentMode}-mode-datatable`}
                        sx={DataGridStyles}
                      >
                        <DataGrid
                          autoHeight
                          disableSelectionOnClick
                          rows={pageState.data}
                          columns={columns}
                          // rowCount={pageState.total}
                          // loading={pageState.isLoading}
                          rowsPerPageOptions={[30, 50, 75, 100]}
                          pagination
                          componentsProps={{
                            toolbar: {
                              showQuickFilter: false,
                              printOptions: {
                                disableToolbarButton: User?.role !== 1,
                              },
                              csvOptions: {
                                disableToolbarButton: User?.role !== 1,
                              },
                              // value: searchText,
                              // onChange: HandleQuicSearch,
                            },
                          }}
                          width="auto"
                          paginationMode="server"
                          // page={pageState.page - 1}
                          // pageSize={pageState.pageSize}
                          sx={{
                            boxShadow: 2,
                            "& .MuiDataGrid-cell:hover": {
                              cursor: "pointer",
                            },
                          }}
                          getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0
                              ? "even"
                              : "odd"
                          }
                        />
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>

      {imagePickerModal.isOpen && (
        <ImagePicker
          imagePickerModal={imagePickerModal}
          setImagePickerModal={setImagePickerModal}
        />
      )}
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default SingleEmployee;
