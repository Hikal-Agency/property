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
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Select, MenuItem } from "@mui/material";
import moment from "moment";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
} from "react-icons/ri";

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

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [PersonalInfo, setPersonalInfo] = useState({});
  const navigate = useNavigate();
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [empData, setEmpData] = useState(null);

  const handleDayFilter = (event) => {
    setSelectedMonth(event.target.value);

    console.log("date range: ", event.target.value);
  };

  console.log("emp data: ", empData);

  const columns = [
    // { field: "id", headerAlign: "center", headerName: "Sr.No", minWidth: 60 },

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
      field: "checkIns",
      headerAlign: "center",
      headerName: "In-time",
      minWidth: 120,
    },
    {
      field: "attendanceSourcesForCheckIn",
      headerAlign: "center",
      headerName: "In-Source",
      minWidth: 120,
    },
    {
      field: "checkOuts",
      headerAlign: "center",
      headerName: "Out-time",
      minWidth: 120,
    },
    {
      field: "attendanceSourcesForCheckOut",
      headerAlign: "center",
      headerName: "Out-Source",
      minWidth: 120,
    },

    {
      field: "late_minutes",
      headerAlign: "center",
      headerName: "Late ",
      minWidth: 120,
      renderCell: (params) => (
        <>
          {params.row.is_late === 1 || params.row.is_late === 2 ? (
            params.row.late_minutes
          ) : (
            <div className="flex justify-between px-5 py-3">
              <Tooltip title="Complete" arrow>
                <IconButton
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    fontSize: "1rem",
                  }}
                  className="rounded-full"
                  // onClick={(event) => handleButtonClick(event, 1, reminder?.id)}
                  // disabled={completeLoading}
                >
                  {/* {completeLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <CheckIcon />
                  )} */}
                  <CheckIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cancel" arrow>
                <IconButton
                  style={{
                    backgroundColor: "#DC2626",
                    color: "white",
                    fontSize: "1rem",
                    marginLeft: "5%",
                  }}
                  className="rounded-full"
                  // onClick={(event) => handleButtonClick(event, 0, reminder?.id)}
                  // disabled={cancleLoading}
                >
                  {/* {cancleLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <CloseIcon />
                  )} */}
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </>
      ),
    },
    {
      field: "late_reason",
      headerAlign: "center",
      headerName: "Reason",
      minWidth: 250,
    },
    // {
    //   field: "salary",
    //   headerAlign: "center",
    //   headerName: "Salary",
    //   minWidth: 120,
    // },
    {
      field: "deduction",
      headerName: "Salary Deduction",
      headerAlign: "center",
      minWidth: 120,
      renderCell: (params) => (
        <>{pageState.deduction === 1 ? pageState.cut_salary : "-"}</>
      ),
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
          {/* <IconButton>
            <MdDelete />
          </IconButton> */}
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

  // Custom function to check if it's a "checkin" or "in"
  function isCheckIn(row) {
    return (
      row.checkIn.toLowerCase() === "in" ||
      row.checkIn.toLowerCase() === "check-in"
    );
  }

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

  console.log("logging selectedmonth: ", selectedMonth);

  const FetchAttendance = async (token) => {
    const params = {
      page: pageState.page,
    };

    // if (selectedMonth) {
    //   if (selectedMonth === "today") {
    //     params.date_range = [
    //       moment().subtract(1, "days").format("YYYY-MM-DD"),
    //       moment().add(1, "days").format("YYYY-MM-DD"),
    //     ].join(",");
    //   } else if (selectedMonth === "yesterday") {
    //     params.date_range = [
    //       moment().subtract(2, "days").format("YYYY-MM-DD"),
    //       moment().format("YYYY-MM-DD"),
    //     ].join(",");
    //   } else if (selectedMonth === "month") {
    //     // Apply default date range of the complete month
    //     const startDate = moment()
    //       .subtract(1, "months")
    //       .endOf("month")
    //       .format("YYYY-MM-DD");
    //     const endDate = moment()
    //       .add(1, "months")
    //       .startOf("month")
    //       .format("YYYY-MM-DD");
    //     params.date_range = [startDate, endDate].join(",");
    //   }
    // } else if (selectedMonth === "month") {
    //   // Apply default date range of the complete month
    //   const startDate = moment().startOf("month").format("YYYY-MM-DD");
    //   const endDate = moment().endOf("month").format("YYYY-MM-DD");
    //   params.date_range = [startDate, endDate].join(",");
    // }
    if (selectedMonth) {
      console.log("month filter: ", selectedMonth);

      // Check if selectedMonth is a valid month (between 1 and 12)
      const isValidMonth =
        Number(selectedMonth) >= 1 && Number(selectedMonth) <= 12;

      if (isValidMonth) {
        // Convert selectedMonth to "YYYY-MM" format
        const year = moment().format("YYYY");
        const month = String(selectedMonth).padStart(2, "0");
        const selectedMonthInYYYYMM = `${year}-${month}`;

        const startDate = moment(selectedMonthInYYYYMM)
          .startOf("month")
          .format("YYYY-MM-DD");
        const endDate = moment(selectedMonthInYYYYMM)
          .endOf("month")
          .format("YYYY-MM-DD");
        params.date_range = [startDate, endDate].join(",");
      } else {
        // Handle invalid selectedMonth (e.g., if user manually inputs an invalid date)
        console.error("Invalid selectedMonth:", selectedMonth);
      }
    } else {
      // Apply default date range of the complete current month
      const startDate = moment().startOf("month").format("YYYY-MM-DD");
      const endDate = moment().endOf("month").format("YYYY-MM-DD");
      params.date_range = [startDate, endDate].join(",");
    }

    await axios
      .get(`${BACKEND_URL}/attendance?user_id=${id}`, {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("fetched data ", result.data);

        const data = result.data.Record.data;

        let rowsdata = data?.reduce((acc, row) => {
          const date = moment(row?.check_datetime).format("YYYY-MM-DD");
          const existingRow = acc.find((item) => item.date === date);

          const attendanceType = row?.attendance_type.toLowerCase();
          const checkTime = row?.check_datetime
            ? moment(row.check_datetime).format("hh:mm A")
            : "-";

          if (!existingRow) {
            acc.push({
              date,
              checkIns:
                attendanceType === "in" || attendanceType === "check-in"
                  ? [checkTime]
                  : [],
              checkOuts:
                attendanceType === "out" || attendanceType === "check-out"
                  ? [checkTime]
                  : [],
              attendanceSourcesForCheckIn:
                attendanceType === "in" || attendanceType === "check-in"
                  ? [row.attendance_source || "-"]
                  : [],
              attendanceSourcesForCheckOut:
                attendanceType === "out" || attendanceType === "check-out"
                  ? [row.attendance_source || "-"]
                  : [],
              ...otherFields(row),
            });
          } else {
            if (attendanceType === "in" || attendanceType === "check-in") {
              existingRow.checkIns.push(checkTime);
              existingRow.attendanceSourcesForCheckIn.push(
                row.attendance_source || "-"
              );
            } else if (
              attendanceType === "out" ||
              attendanceType === "check-out"
            ) {
              existingRow.checkOuts.push(checkTime);
              existingRow.attendanceSourcesForCheckOut.push(
                row.attendance_source || "-"
              );
            }
          }

          return acc;
        }, []);

        function otherFields(row) {
          // Add other fields as needed
          return {
            id: row.id,

            checkIn:
              row?.attendance_type.toLowerCase() === "in" ||
              row?.attendance_type.toLowerCase() === "check-in"
                ? "In"
                : "-",
            checkOut:
              row?.attendance_type.toLowerCase() === "out" ||
              row?.attendance_type.toLowerCase() === "check-out"
                ? "Out"
                : "-",
            attendance_type: row?.attendance_type,
            check_datetime: row?.check_datetime,
            default_datetime: row?.default_datetime,
            is_late: row?.is_late || "-",
            late_reason: row?.late_reason || "-",
            late_minutes: row?.late_minutes || "-",
            salary: row?.salary,
            profile_picture: row?.profile_picture,
            position: row?.position || "-",
            currency: row?.currency || "-",
            userName: row?.userName || "-",
            created_at: row?.created_at,
            updated_at: row?.updated_at,
            deduction: row?.deduct_salary,
            cut_salary: row?.cut_salary || "-",
            edit: "edit",
          };
        }

        // Concatenate check-ins, check-outs, and attendance_sources into a single comma-separated string
        rowsdata = rowsdata.map((row) => ({
          ...row,
          checkIns: row.checkIns.join(", "),
          checkOuts: row.checkOuts.join(", "),
          attendanceSourcesForCheckIn:
            row.attendanceSourcesForCheckIn.join(", "),
          attendanceSourcesForCheckOut:
            row.attendanceSourcesForCheckOut.join(", "),
        }));

        console.log("rowsss:::::::: ", rowsdata);

        const attended_days = rowsdata.filter(
          (row) =>
            row?.attendance_type.toLowerCase() === "in" ||
            row?.attendance_type.toLowerCase() === "check-in"
        );

        const attended_count = attended_days.length;
        console.log("attended days: ", attended_count);

        const leave_days = rowsdata.filter(
          (row) =>
            row?.attendance_type.toLowerCase() === "out" ||
            row?.attendance_type.toLowerCase() === "check-out"
        );
        const leave_count = leave_days.length;
        console.log("leave days: ", leave_count);

        const is_late = rowsdata.filter((row) => row?.is_late === 1);
        const late_count = is_late.length;
        console.log("is late: ", late_count);

        const checkInRow = rowsdata.find((row) => isCheckIn(row));

        let deductionValue = "";
        let cutSalaryValue = "";

        if (checkInRow) {
          // Get the value of deduction
          deductionValue = checkInRow.deduction || "";

          // Get the value of cut_salary if deduction is 'one'
          if (deductionValue === 1) {
            cutSalaryValue = checkInRow.cut_salary || "";
          }
        }

        console.log("Deduction Value:", deductionValue);
        console.log("Cut Salary Value:", cutSalaryValue);

        setEmpData(rowsdata);
        setloading(false);

        setpageState((old) => ({
          ...old,
          data: rowsdata,
          attended_count: attended_count,
          leave_count: leave_count,
          late_count: late_count,
          dedution: deductionValue,
          cut_salary: cutSalaryValue,
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
    FetchAttendance(token);
    // eslint-disable-next-line
  }, [pageState.page, selectedMonth]);

  return (
    <>
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
              <div className="pl-3 mt-3">
                <Box sx={darkModeColors}>
                  <div className="flex justify-end">
                    <Select
                      id="monthSelect"
                      size="small"
                      className="w-[100px]"
                      displayEmpty
                      value={selectedMonth}
                      onChange={handleDayFilter}
                    >
                      <MenuItem selected value="month">
                        Select a day
                      </MenuItem>
                      {/* <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="yesterday">Yesterday</MenuItem> */}
                      {lastThreeMonths?.map((month) => (
                        <MenuItem key={month.value} value={month.value + 1}>
                          {month.label}
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
                      <label htmlFor="pick-image">
                        <div className="relative">
                          {empData[0]?.profile_picture ? (
                            <img
                              src={empData[0]?.profile_picture}
                              width={200}
                              height={200}
                              alt=""
                              className="rounded-full mx-auto w-28"
                            />
                          ) : (
                            <Avatar
                              alt="User"
                              variant="circular"
                              style={{ width: "64px", height: "64px" }}
                              className="rounded-full mx-auto w-28"
                            />
                          )}
                        </div>
                      </label>

                      <div className="mb-3">
                        <h1 className="text-lg font-bold text-center">
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
                            <div className="flex items-center space-x-1 justify-center">
                              <h1>Monthly Salary</h1>
                            </div>
                            {empData[0]?.salary
                              ? `${empData[0]?.salary} ${empData[0]?.currency}`
                              : "No data"}
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
                              {empData[0]?.salary && empData[0]?.salary !== null
                                ? empData[0]?.salary / 30
                                : "No data"}
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
                            <div className="flex  justify-center font-semibold ">
                              <h1>Attended Days:</h1>
                            </div>
                            {pageState?.attended_count || "0"}
                          </div>
                          <div
                            className={`mt-3 text-center ${
                              currentMode === "dark"
                                ? "text-gray-50"
                                : "text-gray-600"
                            }`}
                          >
                            <div className="flex justify-center font-semibold ">
                              <h1 className="block">Leave Days : </h1>
                              {"  "}
                              <p className="font-bold pl-1">
                                {"  "} {pageState?.leave_count || "0"}
                              </p>
                            </div>
                            <div className="mt-3">
                              <h1>Late Attendance Days: </h1>
                              <p className="font-bold">
                                {pageState?.late_count || "0"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {empData[0]?.salary ? (
                        <div className="accountinfo border-t-2 border-gray-400 px-5 mt-3 pt-5 ">
                          <div className="flex justify-center flex-col items-center">
                            <div
                              className={`mt-1 text-center ${
                                currentMode === "dark"
                                  ? "text-gray-50"
                                  : "text-gray-600"
                              }`}
                            >
                              <div className="flex  justify-center  font-semibold">
                                <h1>Leave Days Salary:</h1>
                              </div>
                              {pageState?.attended_count || "0"}
                            </div>
                            <div
                              className={`mt-3 text-center ${
                                currentMode === "dark"
                                  ? "text-gray-50"
                                  : "text-gray-600"
                              }`}
                            >
                              <div className="flex justify-center font-semibold mb-1">
                                <h1 className="block">Late Days Salary: </h1>
                                {"  "}
                                <p className="font-bold pl-1">
                                  {"  "} {pageState?.leave_count || "0"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="accountinfo border-t-2  border-b-2 border-gray-400 px-5 mt-3 mb-3 pb-5 pt-5 ">
                        <div className="flex justify-center flex-col items-center">
                          <div
                            className={`mt-1 text-center ${
                              currentMode === "dark"
                                ? "text-gray-50"
                                : "text-gray-600"
                            }`}
                          >
                            <div className="flex  justify-center  font-semibold">
                              <h1>Total Salary:</h1>
                            </div>
                            {empData[0]?.salary || "No data"}
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
