import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ImagePicker from "../../Pages/profile/ImagePicker";
import { DataGrid } from "@mui/x-data-grid";
import usePermission from "../../utils/usePermission";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {
  MdModeEdit,
  MdAttachMoney,
  MdMoneyOff,
  MdPendingActions,
} from "react-icons/md";
import { TfiCheck, TfiClose } from "react-icons/tfi";
import { Select, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

import moment from "moment";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
  RiEyeCloseFill,
} from "react-icons/ri";
import SalaryDeductDailogue from "./SalaryDeductDailogue";
import PasswordDialogue from "./PasswordDialogue";
import { FaDownload } from "react-icons/fa";

const SingleEmployee = ({ user }) => {
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

  const path = window.location.pathname;
  const location = path.split("/").pop();
  const id = location === "attendance_self" ? User?.id : location;

  console.log("id: ", id);
  console.log("user: ", user);

  const [loading, setloading] = useState(true);

  const token = localStorage.getItem("auth-token");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const { hasPermission } = usePermission();

  const [cut_salary, setCutSalary] = useState();
  const [PersonalInfo, setPersonalInfo] = useState({});
  const navigate = useNavigate();
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [empData, setEmpData] = useState(null);
  const [showDailogue, setDialogue] = useState(false);
  const [showApproval, setApproval] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState(false);
  console.log("cut: ", cut_salary);

  const handleDayFilter = (event) => {
    setSelectedMonth(event.target.value);

    console.log("date range: ", event.target.value);
  };

  // LATE REASON
  const updateReason = async (e, id) => {
    console.log("ciklsd;kl", id);
    const employeeData = empData.find((employee) => employee.id === id);
    setDialogue([employeeData, 0]);
    console.log("emp reason: ", employeeData);
  };

  // APPROVAL REQUEST
  const notifyApproval = async (e, id) => {
    console.log("ciklsd;kl", id);
    const employeeData = empData.find((employee) => employee.id === id);
    setDialogue([employeeData, 1]);
    console.log("emp reason: ", employeeData);
  };

  const columns = [
    // { field: "id", headerAlign: "center", headerName: "Sr.No", minWidth: 60 },
    {
      field: "check_datetime",
      headerAlign: "center",
      headerName: "Date",
      minWidth: 70,
      flex: 1,
      renderCell: (cellValues) => {
        const date = moment(cellValues.row.check_datetime).format("YYYY-MM-DD");
        return date;
        // (
        //   <div>
        //     {moment(cellValues.row.check_datetime).format("YYYY-MM-DD")}
        //   </div>
        // );
      },
    },
    {
      field: "checkIns",
      headerAlign: "center",
      headerName: "In-time",
      minWidth: 90,
      flex: 1,
    },
    {
      field: "attendanceSourcesForCheckIn",
      headerAlign: "center",
      headerName: "In-source",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "checkOuts",
      headerAlign: "center",
      headerName: "Out-time",
      minWidth: 90,
      flex: 1,
    },
    {
      field: "attendanceSourcesForCheckOut",
      headerAlign: "center",
      headerName: "Out-source",
      minWidth: 80,
      flex: 1,
    },
    // OFFICE IN TIME
    {
      field: "default_datetime",
      headerAlign: "center",
      headerName: "Office time",
      minWidth: 70,
      flex: 1,
    },

    {
      field: "late_minutes",
      headerAlign: "center",
      headerName: "Late",
      minWidth: 80,
      flex: 1,
      renderCell: (params) => {
        if (params.row.is_late === 1 || params.row.is_late === 2) {
          // If there are late minutes, display the number of minutes as a string
          return params.row.late_minutes + " minutes";
        } else if (hasPermission("mark_late")) {
          // If there are no late minutes, return the buttons wrapped in a component
          return (
            <div className="flex justify-between px-5 py-3">
              <Tooltip title="Yes" arrow>
                <IconButton
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    fontSize: "1rem",
                  }}
                  className="rounded-full"
                  onClick={(event) => lateSalary(event, 1, params?.row.id)}
                >
                  <CheckIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="No" arrow>
                <IconButton
                  style={{
                    backgroundColor: "#DC2626",
                    color: "white",
                    fontSize: "1rem",
                    marginLeft: "5%",
                  }}
                  className="rounded-full"
                  onClick={(event) => lateSalary(event, 2, params?.row.id)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </div>
          );
        } else {
          return "-";
        }
      },
    },

    // LATE REASON
    {
      field: "late_reason",
      headerAlign: "center",
      headerName: "Note/Reason",
      minWidth: 120,
      flex: 1,
    },
    // SALARY DEDUCTION

    {
      field: "cut_salary",
      headerName: "Deduct",
      headerAlign: "center",
      minWidth: 80,
      flex: 1,
      renderCell: (params) => {
        if (params.row.deduction === 1) {
          return params.row.currency + " " + params.row.cut_salary;
        } else {
          return "-";
        }
      },
    },
    // ACTION
    {
      field: "deduct_salary",
      headerName: "Action",
      headerAlign: "center",
      minWidth: 100,
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <div className={`space-x-1 w-full flex items-center justify-center`}>
          <Tooltip title="Edit Note/Reason" arrow>
            {hasPermission("late_reason") ? (
              <IconButton
                onClick={(event) => updateReason(event, params?.row.id)}
              >
                <MdModeEdit
                  size={16}
                  className={` ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                />
              </IconButton>
            ) : (
              <IconButton>
                <MdModeEdit
                  size={16}
                  className={` ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                />
              </IconButton>
            )}
          </Tooltip>
          {/* PENDING FOR DEDUCT SALARY  */}
          {/* {params.row.notify_status === "Pending" &&
          params.row.notify_deduct_salary === 1 ? (
            <> */}
          {/* ROLE 1 */}
          {/* {User?.role === 1 ? ( */}
          {/* <>
                  <Tooltip title="Pending Approval Request" arrow>
                    <IconButton> */}
          {/* ON CLICK => OPEN POPUP SHOWING CHECK IN TIME AND LATE MINUTES AND LATE REASON WITH TWO ICON BUTTONS: GREEN TICK AND RED CROSS */}
          {/* GREEN TICK => notify_status = "Approved", deduct_salary = 1   */}
          {/* RED CROSS => notify_status = "Rejected", deduct_salary = 2, cut_salary = "No"  */}
          {/* <MdPendingActions
                        onClick={(event) =>
                          notifyApproval(event, params?.row.id)
                        }
                        size={16}
                        className="text-red-600"
                      />
                    </IconButton>
                  </Tooltip>
                </> */}
          {/* ) : ( */}
          {/* <> */}
          {/* DO NOTHING */}
          {/* <Tooltip title="Pending Approval" arrow>
                    <IconButton>
                      <MdPendingActions size={16} className="text-red-600" />
                    </IconButton>
                  </Tooltip>
                </> */}
          {/* )}
            </>
          ) : // PENDING FOR UNDEDUCT SALARY */}
          {params.row.notify_status === "Pending" &&
          params.row.notify_deduct_salary === 2 ? (
            <>
              {/* ROLE 1 */}
              {hasPermission("deduct_salary") && (
                <>
                  <Tooltip title="Pending Approval Request" arrow>
                    {User?.role === 1 ? (
                      <IconButton>
                        {/* ON CLICK => OPEN POPUP SHOWING CHECK IN TIME AND LATE MINUTES AND LATE REASON WITH TWO ICON BUTTONS: GREEN TICK AND RED CROSS */}
                        {/* GREEN TICK => notify_status = "Approved", deduct_salary = 2, cut_salary = "No", is_late = 2   */}
                        {/* RED CROSS => notify_status = "Rejected"  */}

                        <MdPendingActions
                          onClick={(event) =>
                            notifyApproval(event, params?.row.id)
                          }
                          size={16}
                          className="text-red-600"
                        />
                      </IconButton>
                    ) : (
                      <IconButton>
                        <MdPendingActions size={16} className="text-red-600" />
                      </IconButton>
                    )}
                  </Tooltip>
                </>
              )}
            </>
          ) : params.row.notify_status === "Rejected" ? (
            // REJECTED
            <>
              <Tooltip title="Rejected" arrow>
                <IconButton>
                  <TfiClose
                    size={20}
                    className={`${
                      currentMode === "dark" ? "text-red-600" : "text-red-600"
                    }`}
                  />
                </IconButton>
              </Tooltip>
            </>
          ) : params.row.notify_status === "Approved" ? (
            // APPROVED
            <>
              <Tooltip title="Approved" arrow>
                <IconButton>
                  <TfiCheck
                    size={20}
                    className={`${
                      currentMode === "dark"
                        ? "text-green-600"
                        : "text-green-600"
                    }`}
                  />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            // NOT PENDING
            <>
              {hasPermission("deduct_salary") ? (
                <>
                  {params.row.is_late === 1 ? (
                    <Tooltip title="Don't Deduct Salary" arrow>
                      <IconButton
                        onClick={(event) =>
                          undeductSalary(event, params?.row.id)
                        }
                      >
                        <MdMoneyOff
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      ),
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

  function calculateWorkingDays(offDay) {
    // Get the current month and year
    const currentDate = moment();
    const currentMonth = currentDate.month();
    const currentYear = currentDate.year();

    // Get the number of days in the current month
    const daysInMonth = currentDate.daysInMonth();

    // Initialize an array to store the working days
    const workingDays = [];

    // Loop through each day of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(
        `${currentYear}-${currentMonth + 1}-${day}`,
        "YYYY-MM-DD"
      );

      // Check if the day is not an off-day (you can replace 'Sunday' with the name of your off-day)
      if (date.format("dddd") !== offDay) {
        workingDays.push(date.format("YYYY-MM-DD"));
      }
    }

    console.log("Working Days:", workingDays);

    return workingDays.length;
  }

  // Btn loading
  const [btnloading, setbtnloading] = useState(false);

  console.log("logging selectedmonth: ", selectedMonth);

  const FetchAttendance = async (token) => {
    const params = {
      page: pageState.page,
    };

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

        const firstCheckIn = data?.find((element) => {
          return (
            element.attendance_type.toLowerCase() === "in" ||
            element.attendance_type.toLowerCase() === "check-in"
          );
        });

        console.log("first check in:: ", firstCheckIn);

        const workingDays = calculateWorkingDays(firstCheckIn?.off_day);

        console.log("working days: ", workingDays);

        console.log("first check in : ", firstCheckIn);

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
            off_day: row?.off_day || "-",
            notify_status: row?.notify_status || "",
            notify_deduct_salary: row?.notify_deduct_salary || "",
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

        const leave_count = workingDays - attended_count;
        console.log("leave days: ", leave_count);

        const is_late = rowsdata.filter((row) => row?.is_late === 1);
        const late_count = is_late.length;
        console.log("is late: ", late_count);

        const checkInRow = rowsdata.find((row) => isCheckIn(row));

        const per_day_salary = firstCheckIn?.salary / 30;
        const LEAVE_DAY_SALARY = per_day_salary * leave_count;
        const LATE_DAY_SALARY = (per_day_salary * late_count) / 2;
        // const TOTAl_SALARY =
        //   firstCheckIn?.salary - (LEAVE_DAY_SALARY + LATE_DAY_SALARY);
        const TOTAl_SALARY = (
          firstCheckIn?.salary -
          (LEAVE_DAY_SALARY + LATE_DAY_SALARY)
        ).toFixed(2);

        let deductionValue = "";
        let cutSalaryValue = "";

        if (checkInRow) {
          console.log("checkinrows: ", checkInRow);
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
        setCutSalary(cutSalaryValue);
        setloading(false);

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          attended_count: attended_count,
          leave_count: leave_count,
          late_count: late_count,
          dedution: deductionValue,
          cut_salary: cutSalaryValue,
          first_check: firstCheckIn,
          workingDays: workingDays,
          leaveDaySalary: LEAVE_DAY_SALARY,
          lateDaySalary: LATE_DAY_SALARY,
          totalSalary: TOTAl_SALARY,
          perDaySalary: per_day_salary,
          pageSize: result?.data?.Record?.per_page,
          total: result?.data?.Record?.total,
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

  // ON LATE
  const lateSalary = async (e, btn, id) => {
    console.log("id", id);

    // Find the data with the matching id in the empdata array
    const employeeData = empData.find((employee) => employee.id === id);
    console.log("logging single emp row:::: ", employeeData);

    console.log("default time: ", employeeData?.default_datetime);
    console.log("check time: ", employeeData?.check_datetime);

    // Calculate the difference in minutes
    const checkTime = moment(employeeData?.check_datetime).format("HH:mm");

    let lateMinutes = moment(checkTime, "HH:mm").diff(
      moment(employeeData?.default_datetime, "HH:mm"),
      "minutes"
    );

    setpageState((oldPageState) => ({
      ...oldPageState,
      lateMinutes: lateMinutes,
    }));

    console.log(
      "late minutes: ",
      lateMinutes,
      pageState?.first_check?.check_datetime,
      employeeData?.default_datetime
    );

    const monthly_salary = employeeData?.salary / 30;
    let deduted_salary = monthly_salary / 2;

    const UpdateData = new FormData();

    // LATE - YES
    if (btn === 1) {
      console.log("deducted salary: ", deduted_salary);
      UpdateData.append("is_late", 1);
      UpdateData.append("late_minutes", lateMinutes);
      UpdateData.append("deduct_salary", 1);
      UpdateData.append("notify_status", "Direct");
      UpdateData.append("cut_salary", deduted_salary.toString());
    }
    // if (btn === 1) {
    //   if (User?.role === 1) {
    //     console.log("deducted salary: ", deduted_salary);

    //     UpdateData.append("is_late", 1);
    //     UpdateData.append("late_minutes", lateMinutes);
    //     UpdateData.append("deduct_salary", 1);
    //     UpdateData.append("notify_status", "Direct");
    //     UpdateData.append("cut_salary", deduted_salary.toString());
    //   } else {
    //     UpdateData.append("is_late", 1);
    //     UpdateData.append("late_minutes", lateMinutes);
    //     UpdateData.append("notify_status", "Direct");
    //     UpdateData.append("deduct_salary", 1);
    //     UpdateData.append("cut_salary", deduted_salary.toString());
    //   }
    // }

    // LATE - NO
    else if (btn === 2) {
      console.log("btn2");

      const defaultDatetime = employeeData?.default_datetime;
      const formattedDatetime = moment(defaultDatetime, "HH:mm");
      const datetimePlus10Minutes = formattedDatetime
        .clone()
        .add(10, "minutes");

      console.log(
        "10mins::::::::::::::::::::::::: " +
          datetimePlus10Minutes.format("HH:mm")
      );

      if (
        moment(pageState?.first_check?.check_datetime, "HH:mm") >
        datetimePlus10Minutes.format("HH:mm")
      ) {
        console.log("lates::::::::::::::");
        UpdateData.append("is_late", 1);
        UpdateData.append("late_minutes", lateMinutes);
        UpdateData.append("deduct_salary", 2);
      } else if (
        // moment(pageState?.first_check?.check_datetime, "HH:mm") >
        moment(pageState?.first_check?.check_datetime, "HH:mm") >
        moment(employeeData?.default_datetime, "HH:mm")
      ) {
        console.log("lates::::::::::::::");
        UpdateData.append("is_late", 2);
        UpdateData.append("late_minutes", lateMinutes);
        UpdateData.append("deduct_salary", 2);
      } else if (
        moment(pageState?.first_check?.check_datetime, "HH:mm") <=
        moment(employeeData?.default_datetime, "HH:mm")
      ) {
        console.log("No late:::::::::");
        UpdateData.append("is_late", 2);
      }
    }

    try {
      const UpdateUser = await axios.post(
        `${BACKEND_URL}/attendance/${employeeData?.id}`,
        UpdateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Attendance updated successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setloading(false);
      FetchAttendance();

      console.log("Response: ", UpdateUser);
    } catch (error) {
      setloading(false);
      console.log("Error: ", error);
      toast.error("Unable to update.", {
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

  // DEDUCT SALARY
  const deductSalary = async (e, id) => {
    console.log("user id : ", id);
    const employeeData = empData.find((employee) => employee.id === id);

    console.log("deduct_salary_emp_data: ", employeeData);

    setpageState((oldPageState) => ({
      ...oldPageState,
    }));

    const monthly_salary = employeeData?.salary / 30;
    let deduted_salary = monthly_salary / 2;

    console.log("deduct_salary: ", deduted_salary);

    const UpdateData = new FormData();

    if (User?.role === 1) {
      UpdateData.append("deduct_salary", 1);
      UpdateData.append("notify_status", "Direct");
      UpdateData.append("cut_salary", deduted_salary.toString());
    } else {
      UpdateData.append("notify_status", "Pending");
      UpdateData.append("notify_deduct_salary", 1);
      UpdateData.append("cut_salary", deduted_salary.toString());
    }

    try {
      const UpdateUser = await axios.post(
        `${BACKEND_URL}/attendance/${employeeData?.id}`,
        UpdateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Salary Deduction Request Sent Successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setloading(false);
      FetchAttendance();

      console.log("Response: ", UpdateUser);
    } catch (error) {
      setloading(false);
      console.log("Error: ", error);
      toast.error("Unable to update.", {
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

  // UNDEDUCT SALARY
  const undeductSalary = async (e, id) => {
    console.log("undeduct id: ", id);
    const employeeData = empData.find((employee) => employee.id === id);

    setpageState((oldPageState) => ({
      ...oldPageState,
    }));

    const UpdateData = new FormData();

    if (User?.role === 1) {
      UpdateData.append("deduct_salary", 2);
      UpdateData.append("notify_status", "Direct");
      UpdateData.append("cut_salary", "No");
      UpdateData.append("is_late", 2);
    } else {
      UpdateData.append("notify_status", "Pending");
      UpdateData.append("notify_deduct_salary", 2);
    }

    try {
      const UpdateUser = await axios.post(
        `${BACKEND_URL}/attendance/${employeeData?.id}`,
        UpdateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (User?.role === 1) {
        toast.success("Salary Undeducted successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.success("Salary Undeduct Request Sent successfully.", {
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

      setloading(false);
      FetchAttendance();

      console.log("Response: ", UpdateUser);
    } catch (error) {
      setloading(false);
      console.log("Error: ", error);
      toast.error("Unable to update.", {
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

  const exportDataGridAsPDF = () => {
    const doc = new jsPDF({
      format: [300, 300], // Set the custom page size (width, height) in user units
      unit: "mm", // Set the unit of measurement to millimeters
    });

    // Custom table headers (exclude the "Action" column)
    const headers = columns
      .filter((column) => column.field !== "deduct_salary")
      .map((column) => column.headerName);

    // Extract data from each row for each column (exclude the "Action" column)
    const tableData = pageState?.data?.map((row) =>
      columns
        .filter((column) => column.field !== "deduct_salary")
        .map((column) => {
          if (column.field === "late_minutes") {
            // If "Late" column contains buttons, return null
            if (row.is_late === 1 || row.is_late === 2) {
              return column.renderCell
                ? column.renderCell({ row })
                : row[column.field];
            } else {
              return "null";
            }
          } else {
            // For other columns, return the data
            return column.renderCell
              ? column.renderCell({ row })
              : row[column.field];
          }
        })
    );

    // Add the table to the PDF only if there are valid rows with data
    if (tableData.length > 0) {
      // Calculate the total width of the table
      const totalWidth = headers.length * 30;

      // Reduce the font size for the table content
      const fontSize = 8;

      // Show the total salary separately
      const currency = empData[0]?.currency || "No Currency";
      const formatText = (text) => `• ${text}`; // Function to format the text as bullet points

      doc.setTextColor("#1976D2"); // Set text color to a nice blue

      // Position the salary text above the table
      doc.text(`Employee Information`, 15, 10);
      doc.setTextColor("#000"); // Reset text color to black

      doc.text(`Username: ${empData[0]?.userName || "No Name"}`, 15, 18);
      // doc.text(`Position: ${empData[0]?.position || "No Position"}`, 15, 24);

      doc.setTextColor("#1976D2"); // Set text color to a nice blue
      doc.text(`Salary Information`, 15, 35);
      doc.setTextColor("#000"); // Reset text color to black

      doc.text(
        formatText(`Monthly Salary: ${currency} ${empData[0]?.salary || "0"} `),
        15,
        43
      );
      doc.text(
        formatText(`Salary Per Day: ${pageState?.perDaySalary || "0"}`),
        15,
        50
      );

      doc.text(
        formatText(`Working Days: ${pageState?.workingDays || "No Data"}`),
        15,
        57
      );
      doc.text(
        formatText(`Attended Days: ${pageState?.attended_count || "No Data"}`),
        15,
        64
      );
      doc.text(
        formatText(`Leave Days: ${pageState?.leave_count || "No Data"}`),
        15,
        71
      );

      doc.text(
        formatText(`Late Attended Days: ${pageState?.late_count || "No Data"}`),
        15,
        78
      );

      doc.text(
        formatText(
          `Leave Day Salary: ${currency} ${pageState?.leaveDaySalary || "0"}`
        ),
        15,
        85
      );
      doc.text(
        formatText(
          `Late Day Salary: ${currency} ${pageState?.lateDaySalary || "0"}`
        ),
        15,
        92
      );

      doc.text(
        formatText(
          `Total Salary:  ${currency} ${pageState?.totalSalary || "0"}`
        ),
        15,
        99
      );

      doc.setTextColor("#000"); // Reset text color to black

      // Create a watermark canvas and apply blur effect
      const watermarkCanvas = document.createElement("canvas");
      const ctx = watermarkCanvas.getContext("2d");
      const watermarkImg = new Image();

      watermarkImg.src = "/assets/hikal_watermark.png"; // Correct URL to the watermark image

      watermarkImg.onload = () => {
        const imgWidth = 400; // Adjust the image width as needed
        const imgHeight = 400; // Adjust the image height as needed

        // Set the canvas size
        watermarkCanvas.width = imgWidth;
        watermarkCanvas.height = imgHeight;

        // Apply blur to the watermark image
        ctx.filter = "blur(1px)"; // Adjust the blur level as needed
        ctx.globalAlpha = 0.1; // Adjust the opacity level (0 to 1, where 0 is fully transparent and 1 is fully opaque)

        ctx.translate(watermarkCanvas.width / 2, watermarkCanvas.height / 2);
        ctx.rotate(-30 * (Math.PI / 180)); // Adjust the tilt angle as needed
        ctx.drawImage(
          watermarkImg,
          -watermarkCanvas.width / 2,
          -watermarkCanvas.height / 2,
          imgWidth,
          imgHeight
        );

        // Add the blurred watermark as an image to the PDF in the background
        doc.addImage(
          watermarkCanvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          doc.internal.pageSize.getWidth(),
          doc.internal.pageSize.getHeight()
        );

        // Add the table to the PDF
        doc.autoTable({
          head: [headers],
          body: tableData,
          tableWidth: totalWidth,
          startY: 110, // Adjust the starting y-coordinate for the table to avoid overlapping with the salary text
          styles: {
            fontSize: fontSize,
            cellPadding: 2,
          },
          autoSize: true,
          minCellWidth: 40,
          margin: { top: 130, right: 15, bottom: 20, left: 15 }, // Adjust margins
        });

        // Save the PDF with the specified file name
        doc.save(`${empData[0]?.userName}-attendance.pdf`);
      };
    } else {
      // Handle the case when there are no valid rows to export
      alert("No valid data to export!");
    }
  };

  useEffect(() => {
    setopenBackDrop(false);
    // const token = localStorage.getItem("auth-token");
    FetchAttendance();
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
                <Box
                  sx={{
                    ...darkModeColors,
                    display: "flex",
                    justifyContent: "right",
                    marginTop: "3%",
                  }}
                >
                  <div className="flex">
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 30 }}>
                      <Select
                        id="monthSelect"
                        // size="small"
                        className="w-[100px]"
                        displayEmpty
                        value={selectedMonth}
                        onChange={handleDayFilter}
                      >
                        {/* <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="yesterday">Yesterday</MenuItem> */}
                        {lastThreeMonths?.map((month) => (
                          <MenuItem key={month.value} value={month.value + 1}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="flex mx-3">
                    <Tooltip title="Download Report" arrow>
                      <IconButton
                        className={`p-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                        ripple={true}
                        size="small"
                        type="submit"
                        onClick={() => setPasswordConfirm(true)}
                        // sx={{ border: "1px solid #DA1F26" }}
                      >
                        <FaDownload size={14} color={`#DA1F26`} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Box>

                {/* SALARY CALC & TABLE  */}
                <div className="my-5 mb-10">
                  <div
                    className={`grid grid-cols-12 ${
                      currentMode === "dark"
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900 "
                    } rounded-md shadow-md`}
                  >
                    <div className="col-span-2 px-2 pb-2 text-sm">
                      <div className="rounded-md shadow-md border-gray-400 p-3 mb-1">
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
                        <div className="m-3">
                          <h1
                            className={`${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-black"
                            }  text-center font-bold text-base`}
                          >
                            {empData[0]?.userName || User?.userName}
                          </h1>
                          <h3
                            className={`${
                              currentMode === "dark"
                                ? "text-gray-50"
                                : "text-gray-600"
                            }  text-center text-sm`}
                          >
                            {empData[0]?.position || User?.position}
                          </h3>
                        </div>
                      </div>
                      {/* MONTHLY SALARY AND SALARY PER DAY  */}
                      <div
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-black"
                        } accountinfo rounded-md shadow-md border-gray-400 p-3 my-1`}
                      >
                        <div className="flex justify-center flex-col items-center gap-y-3 my-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <h1 className="font-semibold">Monthly salary</h1>
                            </div>
                            {empData[0]?.salary
                              ? `${empData[0]?.currency} ${empData[0]?.salary} `
                              : "-"}
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <h1 className="font-semibold">Salary per day</h1>
                            </div>
                            {empData[0]?.salary && empData[0]?.salary !== null
                              ? `${empData[0]?.currency} ${pageState?.perDaySalary}`
                              : "-"}
                          </div>
                        </div>
                      </div>
                      {/* ATTENDED AND LEAVE DAYS  */}
                      <div
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-black"
                        } accountinfo rounded-md shadow-md border-gray-400 p-3 my-1`}
                      >
                        <div className="flex justify-center flex-col items-center gap-y-3 my-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <p className="font-bold text-red-600 pr-2">
                                {"  "} {pageState?.workingDays || "0"}{" "}
                                {/*CHANGE WORKING DAYS*/}
                              </p>
                              {"  "}
                              <h1 className="font-semibold text-sm">
                                working days
                              </h1>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <p className="font-bold text-red-600 pr-2">
                                {"  "} {pageState?.attended_count || "0"}
                              </p>
                              {"  "}
                              <h1 className="font-semibold text-sm">
                                attended days
                              </h1>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <p className="font-bold text-red-600 pr-2">
                                {"  "} {pageState?.leave_count || "0"}
                              </p>
                              {"  "}
                              <h1 className="font-semibold">leave days</h1>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <p className="font-bold text-red-600 pr-2">
                                {"  "} {pageState?.late_count || "0"}
                              </p>
                              {"  "}
                              <h1 className="font-semibold text-sm">
                                late attendance days
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* DEDUCTED SALARY  */}
                      {empData[0]?.salary ? (
                        <div
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          } accountinfo rounded-md shadow-md border-gray-400 p-3 my-1`}
                        >
                          <div className="flex justify-center flex-col items-center gap-y-3 my-2">
                            <div className="text-center">
                              <div className="flex items-center justify-center">
                                <h1 className="font-semibold">
                                  Leave days salary
                                </h1>
                              </div>
                              {/* (SALARY_PER_DAY * TOTAL_LEAVE_DAYS) =========== TOTAL_LEAVE_DAYS = WORKING_DAYS - ATTENDED_DAYS */}
                              {empData[0]?.salary
                                ? `${empData[0]?.currency} ${pageState?.leaveDaySalary} `
                                : "-"}
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center">
                                <h1 className="font-semibold">
                                  Late days salary
                                </h1>
                              </div>
                              {/* (SALARY_PER_DAY * TOTAL_LATE_DAYS) / 2 ========== TOTAL_LATE_DAYS = COUNT(is_late) WHERE is_late = 1 */}
                              {empData[0]?.salary && empData[0]?.salary !== null
                                ? `${empData[0]?.currency} ${pageState?.lateDaySalary}`
                                : "-"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {/* TOTAL SALARY  */}
                      <div
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-black"
                        } accountinfo rounded-md shadow-md border-gray-400 p-3 my-1`}
                      >
                        <div className="flex justify-center flex-col items-center gap-y-3 my-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <h1 className="font-semibold">Total salary</h1>
                            </div>
                            {/* MONTHLY_SALARY - (LEAVE_DAY_SALARY + LATE_DAYA_SALARY) */}
                            {empData[0]?.salary
                              ? `${empData[0]?.currency} ${pageState?.totalSalary} `
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* section 2 */}
                    <div className="col-span-10 ">
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
                          loading={pageState.isLoading}
                          rowsPerPageOptions={[]}
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
                          page={pageState.page - 1}
                          pageSize={pageState.pageSize}
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
                          onPageChange={(newPage) => {
                            setpageState((old) => ({
                              ...old,
                              page: newPage + 1,
                            }));
                          }}
                          onPageSizeChange={(newPageSize) =>
                            setpageState((old) => ({
                              ...old,
                              pageSize: newPageSize,
                            }))
                          }
                        />
                      </Box>
                    </div>
                    {showDailogue && (
                      <SalaryDeductDailogue
                        showDailogue={showDailogue}
                        setDialogue={setDialogue}
                      />
                    )}
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
      {passwordConfirm && (
        <PasswordDialogue
          passwordConfirm={passwordConfirm}
          setPasswordConfirm={setPasswordConfirm}
          exportDataGridAsPDF={exportDataGridAsPDF}
        />
      )}
    </>
  );

  function convertTo12HourFormat(time24Hour) {
    const [hours, minutes] = time24Hour.split(":");
    const parsedHours = parseInt(hours, 10);

    let meridiem = "AM";
    let formattedHours = parsedHours;

    if (parsedHours === 0) {
      formattedHours = 12;
    } else if (parsedHours > 12) {
      formattedHours = parsedHours - 12;
      meridiem = "PM";
    }

    return `${formattedHours}:${minutes} ${meridiem}`;
  }
};

export default SingleEmployee;
