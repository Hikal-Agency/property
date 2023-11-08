import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ImagePicker from "../../Pages/profile/ImagePicker";
import { DataGrid } from "@mui/x-data-grid";
import usePermission from "../../utils/usePermission";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { MdModeEdit, MdMoneyOff, MdPendingActions } from "react-icons/md";
import { TfiCheck, TfiClose } from "react-icons/tfi";
import { Select, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

import moment from "moment";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
} from "react-icons/ri";
import SalaryDeductDailogue from "./SalaryDeductDailogue";
import PasswordDialogue from "./PasswordDialogue";
import { FaDownload } from "react-icons/fa";
import MyCalendar from "./MyCalendar";
import EmployeeCalendar from "./EmployeeCalendar";

const SingleEmployee = ({ user }) => {
  const {
    User,
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    DataGridStyles,
    pageState,
    setpageState,
    t,
    themeBgImg,
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
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [empData, setEmpData] = useState(null);
  const [showDailogue, setDialogue] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState(false);
  console.log("cut: ", cut_salary);

  // offdays
  const [offDays, setOffDays] = useState([]);
  const isOffDay = (offDay) => {
    const formattedOffDay = moment(offDay).format("dddd"); // Convert date to day name (e.g., "Sunday")
    return offDays.includes(formattedOffDay);
  };

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
    {
      field: "check_datetime",
      headerAlign: "center",
      headerName: t("date"),
      minWidth: 70,
      flex: 1,
      renderCell: (cellValues) => {
        const date = moment(cellValues.row.check_datetime).format("YYYY-MM-DD");
        return date;
      },
    },
    {
      field: "checkIns",
      headerAlign: "center",
      headerName: t("in_time"),
      minWidth: 90,
      flex: 1,
    },
    {
      field: "attendanceSourcesForCheckIn",
      headerAlign: "center",
      headerName: t("in_source"),
      minWidth: 80,
      flex: 1,
    },
    {
      field: "checkOuts",
      headerAlign: "center",
      headerName: t("out_time"),
      minWidth: 90,
      flex: 1,
    },
    {
      field: "attendanceSourcesForCheckOut",
      headerAlign: "center",
      headerName: t("out_source"),
      minWidth: 80,
      flex: 1,
    },
    // OFFICE IN TIME
    {
      field: "default_datetime",
      headerAlign: "center",
      headerName: t("office_time"),
      minWidth: 70,
      flex: 1,
    },

    {
      field: "late_minutes",
      headerAlign: "center",
      headerName: t("late"),
      minWidth: 80,
      flex: 1,
      renderCell: (params) => {
        if (params?.row?.is_late === 1 || params.row.is_late === 2) {
          return params?.row?.late_minutes + " minutes";
        } else if (hasPermission("mark_late")) {
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

    {
      field: "extra_minutes",
      headerAlign: "center",
      headerName: t("extra"),
      minWidth: 80,
      flex: 1,
      renderCell: (params) => {
        console.log("Params:", params);
        const checkTime = moment(params?.row?.check_datetime).format("HH:mm");
        const checkoutTime = moment(
          `${params?.row?.date} ${moment(
            params?.row?.checkOuts?.split(",")[0],
            "hh:mm A"
          ).format("HH:mm:ss")}`
        ).format("HH:mm");
        const extraMinutes = moment(checkoutTime, "HH:mm").diff(
          moment(params?.row?.defaultCheckout || "06:30 PM", "HH:mm"),
          "minutes"
        );

        let lateMinutes = moment(checkTime, "HH:mm").diff(
          moment(params?.row?.default_datetime || "09:30 AM", "HH:mm"),
          "minutes"
        );

        if (isNaN(lateMinutes) || isNaN(extraMinutes)) {
          return "-";
        } else {
          let totalMinutes = 0;
          if (lateMinutes < 0) {
            totalMinutes += lateMinutes;
          }
          if (extraMinutes > 0) {
            totalMinutes += extraMinutes;
          }

          if (totalMinutes > 0) {
            return totalMinutes?.toString()?.slice(1) + " minutes";
          } else {
            return "-";
          }
        }
      },
    },

    // LATE REASON
    {
      field: "late_reason",
      headerAlign: "center",
      headerName: t("note/reason"),
      minWidth: 120,
      flex: 1,
    },
    // SALARY DEDUCTION

    {
      field: "cut_salary",
      headerName: t("deduct"),
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
      headerName: t("label_action"),
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
                        className="text-primary"
                      />
                    </IconButton>
                  </Tooltip>
                </> */}
          {/* ) : ( */}
          {/* <> */}
          {/* DO NOTHING */}
          {/* <Tooltip title="Pending Approval" arrow>
                    <IconButton>
                      <MdPendingActions size={16} className="text-primary" />
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
                          className="text-primary"
                        />
                      </IconButton>
                    ) : (
                      <IconButton>
                        <MdPendingActions size={16} className="text-primary" />
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
                      currentMode === "dark" ? "text-primary" : "text-primary"
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
      agency_id: User?.agency || 1,
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
        // const endDate = moment(selectedMonthInYYYYMM)
        //   .endOf("month")
        //   .format("YYYY-MM-DD");
        const endDate = moment(selectedMonthInYYYYMM)
          .add(1, "months")
          .startOf("month")
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
        console.log("attended days: ", attended_days);

        const attended_count = attended_days.length;
        console.log("attended count: ", attended_count);

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
      moment(employeeData?.default_datetime || "09:30 AM", "HH:mm"),
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
      UpdateData.append(
        "late_minutes",
        Number(lateMinutes) <= 0 ? 0 : lateMinutes
      );
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
        UpdateData.append(
          "late_minutes",
          Number(lateMinutes) <= 0 ? 0 : lateMinutes
        );
        UpdateData.append("deduct_salary", 2);
      } else if (
        // moment(pageState?.first_check?.check_datetime, "HH:mm") >
        moment(pageState?.first_check?.check_datetime, "HH:mm") >
        moment(employeeData?.default_datetime, "HH:mm")
      ) {
        console.log("lates::::::::::::::");
        UpdateData.append("is_late", 2);
        UpdateData.append(
          "late_minutes",
          Number(lateMinutes) <= 0 ? 0 : lateMinutes
        );
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
      const fontSize = 7;

      // Show the total salary separately
      const currency = empData[0]?.currency || "No Currency";
      const formatText = (text) => `• ${text}`; // Function to format the text as bullet points
      doc.setTextColor("#000"); // Set text color to a nice blue

      // Add the red line above the logo and text
      doc.setDrawColor(218, 31, 38); // Red color
      doc.setLineWidth(1); // Line width
      doc.line(10, 25, doc.internal.pageSize.getWidth() - 10, 25); // Coordinates for the line

      // Add the text "Salary Evaluation Report for <month_name> <year>" in the top left corner
      const currentDate = new Date();
      const monthName = new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(currentDate);
      const year = currentDate.getFullYear();
      const reportText = `Salary Evaluation Report`;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(reportText, 20, 15); // Adjust coordinates as needed
      const month = `${monthName} ${year}:  `;
      const totalSalaryValue = `${currency} ${pageState?.totalSalary || "-"}`;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(month, 18, 33); // Adjust coordinates as needed

      // Set the color to red and make the total salary text bold
      doc.setTextColor("#DA1F26");
      doc.setFont("helvetica", "bold");
      doc.text(totalSalaryValue, 18 + doc.getTextWidth(month), 33);

      const DateinNum = moment().format("YYYY-MM-DD");
      const date = `Date: ${DateinNum}`;
      doc.setTextColor("#000");
      doc.setFontSize(9);

      doc.setFont("helvetica", "normal");
      doc.text(date, doc.internal.pageSize.getWidth() - 45, 33); // Adjust coordinates as needed

      // Horizontally center the username and make it bold
      const usernameWidth = doc.getTextWidth(empData[0]?.userName || "No Name");
      const usernameX = (doc.internal.pageSize.getWidth() - usernameWidth) / 2;
      doc.setFont("helvetica", "bold"); // Set font to bold
      doc.setTextColor("#000");
      doc.setFontSize(14); // Set font to bold
      doc.text(`${empData[0]?.userName || "No Name"}`, usernameX, 45);
      // Adjust the vertical position and font properties for the text
      const textVerticalPosition = 60; // Adjust the vertical position as needed
      const textFontSize = 9;

      doc.setFontSize(textFontSize); // Set the font size
      doc.setFont("helvetica", "normal"); // Set font weight to normal

      doc.setLineWidth(1); // Line width

      // // Calculate the height of the table
      // const tableHeight = doc.autoTable.previous.finalY + 10; // Adjust the offset as needed

      // // Calculate the total height of the content above and below
      // const contentHeight = textVerticalPosition + tableHeight + 40; // Adjust this value based on the total height of the content above and below

      // doc.rect(
      //   10, // X-coordinate of the top-left corner of the rectangle
      //   6, // Y-coordinate of the top-left corner of the rectangle
      //   doc.internal.pageSize.getWidth() - 20, // Width of the rectangle
      //   contentHeight, // Height of the rectangle
      //   "S" // 'S' indicates to stroke (draw) the rectangle
      // );

      // Text above the line
      // Define the text elements and their labels
      const textElements = [
        {
          label: "Monthly salary:",
          value: `${currency} ${empData[0]?.salary || "0"}`,
        },
        {
          label: "Salary per day:",
          value: `${pageState?.perDaySalary || "0"}`,
        },
        {
          label: "Leave day salary:",
          value: `${currency} ${pageState?.leaveDaySalary || "0"}`,
        },
        {
          label: "Late day salary:",
          value: `${currency} ${pageState?.lateDaySalary || "0"}`,
        },
        // {
        //   label: "Total Salary:",
        //   value: `${currency} ${pageState?.totalSalary || "0"}`,
        // },
      ];

      // Define the right side fields and their labels
      const rightSideFields = [
        {
          label: t("working_days"),
          value: `${pageState?.workingDays || "0"}`,
        },
        {
          label: t("attended_days"),
          value: `${pageState?.attended_count || "0"}`,
        },
        {
          label: t("leave_days"),
          value: `${pageState?.leave_count || "0"}`,
        },
        {
          label: t("late_attendance_days"),
          value: `${pageState?.late_count || "0"}`,
        },
      ];

      // Define the number of columns
      const numColumns = 2;

      // Calculate the width of each column
      const columnWidth = (doc.internal.pageSize.getWidth() - 30) / numColumns;

      // Position variables
      let x = 15;
      let y = textVerticalPosition;
      let columnIndex = 0;

      // Loop through the text elements
      textElements.forEach((element) => {
        // Set the text color to black
        doc.setTextColor("#000");

        // Bold and color the text after ":"
        const labelText = `${element.label} `;
        const valueText = element.value;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        // Measure the width of the label and value separately
        const labelWidth = doc.getTextWidth(labelText);
        const valueWidth = doc.getTextWidth(valueText);

        // Calculate the remaining space in the current column
        const remainingWidth = columnWidth - (x - 15);

        // Check if the label and value can fit in the current column
        if (labelWidth + valueWidth <= remainingWidth) {
          doc.text(labelText, x, y);
          doc.setTextColor("#DA1F26");
          doc.setFont("helvetica", "bold");
          doc.text(valueText, x + labelWidth, y);
          y += 10;
        } else {
          // Move to the next column
          columnIndex++;
          x = 15 + columnIndex * columnWidth;
          y = textVerticalPosition;
          doc.text(labelText, x, y);
          doc.setTextColor("#DA1F26");
          doc.setFont("helvetica", "bold");
          doc.text(valueText, x + labelWidth, y);
          y += 10;
        }
      });
      // Reset the position variables for the right side fields
      const xRight = doc.internal.pageSize.getWidth() - 15;
      let yRight = textVerticalPosition;

      // Loop through the right side fields
      rightSideFields.forEach((field) => {
        // Set the text color to black
        doc.setTextColor("#000");

        // Bold and color the text after ":"
        const labelText = `${field.label}`;
        const valueText = field.value;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        // Measure the width of the label and value separately
        const labelWidth = doc.getTextWidth(labelText);
        const valueWidth = doc.getTextWidth(valueText);

        // Calculate the remaining space in the current column
        const remainingWidth = xRight - 15;

        // Check if the label and value can fit in the current column
        if (labelWidth + valueWidth <= remainingWidth) {
          doc.text(labelText, xRight - labelWidth, yRight);
          doc.setTextColor("#DA1F26");
          doc.setFont("helvetica", "bold");
          doc.text(valueText, xRight - labelWidth - 5, yRight);
          yRight += 10;
        } else {
          // Move to the next column
          xRight -= columnWidth;
          yRight = textVerticalPosition;
          doc.text(labelText, xRight - labelWidth, yRight);
          doc.setTextColor("#DA1F26");
          doc.setFont("helvetica", "bold");
          doc.text(valueText, xRight - labelWidth - 5, yRight);
          yRight += 10;
        }
      });

      // Load the logo image
      const logoImg = new Image();
      logoImg.src = "/assets/hikal_watermark.png";
      logoImg.onload = () => {
        const originalWidth = logoImg.width; // Get the original width of the logo
        const originalHeight = logoImg.height; // Get the original height of the logo

        const desiredWidth = 20; // Set the desired width of the logo
        const scaleFactor = desiredWidth / originalWidth; // Calculate the scale factor

        // Calculate the height to maintain the original aspect ratio
        const desiredHeight = originalHeight * scaleFactor;

        // Calculate the position to place the logo in the top right corner
        const logoX = doc.internal.pageSize.getWidth() - desiredWidth - 15;
        const logoY = 8;

        // Add the logo to the PDF with the adjusted dimensions
        doc.addImage(
          logoImg.src,
          "PNG",
          logoX,
          logoY,
          desiredWidth,
          desiredHeight // Use the adjusted height here
        );
        // Add the table to the PDF
        doc.autoTable({
          head: [headers],
          body: tableData,
          tableWidth: totalWidth,
          startY: 120, // Adjust the starting y-coordinate for the table to avoid overlapping with the salary text
          headStyles: {
            fillColor: "#DA1F26",
          },
          styles: {
            fontSize: fontSize,
            cellPadding: 2,
            head: { fillColor: "#DA1F26" },
          },
          autoSize: true,
          minCellWidth: 40,
          margin: { top: 130, right: 15, bottom: 20, left: 15 }, // Adjust margins
        });

        // Add a signature line and text in the bottom right corner
        const signatureLineX = doc.internal.pageSize.getWidth() - 60;
        const signatureLineY = doc.internal.pageSize.getHeight() - 40;
        const signatureLineLength = 25;
        const gapFromRight = 5;

        // Draw the signature line using underscores
        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(
          "_".repeat(signatureLineLength - gapFromRight),
          signatureLineX,
          signatureLineY
        );

        // Calculate the position to center the "Signature" text
        const textWidth = doc.getTextWidth("Signature");
        const textX = signatureLineX + (signatureLineLength - textWidth) / 2;
        const gapFromLine = 5;

        // Add "Signature" text centered and with a gap from the right of the line
        doc.setFontSize(10);
        doc.setTextColor("#000");
        doc.text("Signature", textX, signatureLineY + gapFromLine);

        // Save the PDF with the specified file name
        doc.save(`${empData[0]?.userName}-attendance.pdf`);
      };

      // Handle image load error
      logoImg.onerror = () => {
        console.error("Error loading the logo image.");
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
      <div className="flex h-screen ">
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full p-4">
            <Box
              sx={{
                ...darkModeColors,
                display: "flex",
                justifyContent: "right",
              }}
            >
              <div className="flex mx-2">
                <Tooltip title="Export Attendance Logs" arrow>
                  <IconButton
                    className={`p-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                    ripple={true}
                    size="small"
                    type="submit"
                    onClick={() => setPasswordConfirm(true)}
                    // sx={{ border: "1px solid #DA1F26" }}
                  >
                    <FaDownload
                      size={14}
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } hover:text-primary`}
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="flex">
                <FormControl variant="outlined" sx={{ m: 1, minWidth: 30 }}>
                  <Select
                    id="monthSelect"
                    size="small"
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
            </Box>

            {/* SALARY CALC & TABLE  */}
            <div className="my-5 mb-10">
              <div
                className={`grid grid-cols-1 md:grid-cols-12  ${
                  currentMode === "dark" ? "text-[#EEEEEE]" : "text-black"
                }`}
              >
                <div className="col-span-2 px-2 pb-2 text-sm h-fit">
                  <div
                    className={`${
                      !themeBgImg
                        ? currentMode === "dark"
                          ? "bg-[#1C1C1C]"
                          : "bg-[#EEEEEE]"
                        : currentMode === "dark"
                        ? "blur-bg-dark"
                        : "blur-bg-light"
                    } rounded-xl shadow-sm p-3 mb-1`}
                  >
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
                          currentMode === "dark" ? "text-white" : "text-black"
                        }  text-center font-bold text-base`}
                      >
                        {empData[0]?.userName || User?.userName}
                      </h1>
                      <h3
                        className={`${
                          currentMode === "dark"
                            ? "text-gray-50"
                            : "text-gray-800"
                        }  text-center text-sm`}
                      >
                        {empData[0]?.position || User?.position}
                      </h3>
                    </div>
                  </div>
                  {/* MONTHLY SALARY AND SALARY PER DAY  */}

                  <div
                    className={`${
                      !themeBgImg
                        ? currentMode === "dark"
                          ? "bg-[#1C1C1C]"
                          : "bg-[#EEEEEE]"
                        : currentMode === "dark"
                        ? "blur-bg-dark"
                        : "blur-bg-light"
                    } rounded-xl shadow-sm p-3 my-1`}
                  >
                    <div className="flex justify-center flex-col items-center gap-y-3 my-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <h1 className="font-semibold">
                            {t("monthly_salary")}
                          </h1>
                        </div>
                        <div className="font-bold">
                          {empData[0]?.salary
                            ? `${empData[0]?.currency} ${empData[0]?.salary} `
                            : "-"}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <h1 className="font-semibold">
                            {t("salary_per_day")}
                          </h1>
                        </div>
                        <div className="font-bold">
                          {empData[0]?.salary && empData[0]?.salary !== null
                            ? `${empData[0]?.currency} ${pageState?.perDaySalary}`
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ATTENDED AND LEAVE DAYS  */}

                  <div
                    className={`${
                      !themeBgImg
                        ? currentMode === "dark"
                          ? "bg-[#1C1C1C]"
                          : "bg-[#EEEEEE]"
                        : currentMode === "dark"
                        ? "blur-bg-dark"
                        : "blur-bg-light"
                    } rounded-xl shadow-sm p-3 my-1`}
                  >
                    <div className="flex justify-center flex-col items-center gap-y-3 my-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <p className="font-bold pr-2">
                            {"  "} {pageState?.workingDays || "0"}{" "}
                            {/*CHANGE WORKING DAYS*/}
                          </p>
                          {"  "}
                          <h1 className="font-semibold text-sm">
                            {t("working_days")}
                          </h1>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <p className="font-bold pr-2">
                            {"  "} {pageState?.attended_count || "0"}
                          </p>
                          {"  "}
                          <h1 className="font-semibold text-sm">
                            {t("attended_days")}
                          </h1>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <p className="font-bold pr-2">
                            {"  "} {pageState?.leave_count || "0"}
                          </p>
                          {"  "}
                          <h1 className="font-semibold">{t("leave_days")}</h1>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <p className="font-bold pr-2">
                            {"  "} {pageState?.late_count || "0"}
                          </p>
                          {"  "}
                          <h1 className="font-semibold text-sm">
                            {t("late_attendance_days")}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* DEDUCTED SALARY  */}
                  {empData[0]?.salary ? (
                    <div
                      className={`${
                        !themeBgImg
                          ? currentMode === "dark"
                            ? "bg-[#1C1C1C]"
                            : "bg-[#EEEEEE]"
                          : currentMode === "dark"
                          ? "blur-bg-dark"
                          : "blur-bg-light"
                      } rounded-xl shadow-sm p-3 my-1`}
                    >
                      <div className="flex justify-center flex-col items-center gap-y-3 my-2">
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <h1 className="font-semibold">
                              {t("leave_days_salary")}
                            </h1>
                          </div>
                          {/* (SALARY_PER_DAY * TOTAL_LEAVE_DAYS) =========== TOTAL_LEAVE_DAYS = WORKING_DAYS - ATTENDED_DAYS */}
                          <div className="font-bold">
                            {empData[0]?.salary
                              ? `${empData[0]?.currency} ${pageState?.leaveDaySalary} `
                              : "-"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <h1 className="font-semibold">
                              {t("late_days_salary")}
                            </h1>
                          </div>
                          {/* (SALARY_PER_DAY * TOTAL_LATE_DAYS) / 2 ========== TOTAL_LATE_DAYS = COUNT(is_late) WHERE is_late = 1 */}
                          <div className="font-bold">
                            {empData[0]?.salary && empData[0]?.salary !== null
                              ? `${empData[0]?.currency} ${pageState?.lateDaySalary}`
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* TOTAL SALARY  */}

                  <div
                    className={`${
                      !themeBgImg
                        ? currentMode === "dark"
                          ? "bg-[#1C1C1C]"
                          : "bg-[#EEEEEE]"
                        : currentMode === "dark"
                        ? "blur-bg-dark"
                        : "blur-bg-light"
                    } rounded-xl shadow-sm p-3 my-1`}
                  >
                    <div className="flex justify-center flex-col items-center gap-y-3 my-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <h1 className="font-semibold">{t("total_salary")}</h1>
                        </div>
                        <div className="font-bold">
                          {empData[0]?.salary
                            ? `${empData[0]?.currency} ${pageState?.totalSalary} `
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* section 2 */}
                <div className="col-span-10 ">
                  <Box
                    width={"100%"}
                    height={"100%"}
                    className={`single-emp ${currentMode}-mode-datatable `}
                    sx={{ ...DataGridStyles, paddingLeft: "5px" }}
                  >
                    <DataGrid
                      disableDensitySelector
                      autoHeight
                      disableSelectionOnClick
                      rows={pageState.data}
                      columns={columns}
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
                    <EmployeeCalendar
                      isOffDay={isOffDay}
                      pageState={pageState}
                    />
                  </Box>
                </div>
                {showDailogue && (
                  <SalaryDeductDailogue
                    showDailogue={showDailogue}
                    setDialogue={setDialogue}
                    FetchAttendance={FetchAttendance}
                  />
                )}
              </div>
            </div>
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
};

export default SingleEmployee;
