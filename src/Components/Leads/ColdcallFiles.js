import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { useStateContext } from "../../context/ContextProvider";
import { langs } from "../../langCodes";
import axiosInstance from "../../axoisConfig";
import { toast } from "react-toastify";
import {
  Badge,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import moment from "moment";

const getLangCode = (language) => {
  if (language) {
    const l = langs.find(
      (lang) =>
        lang["name"].toLowerCase() === String(language).toLowerCase() ||
        lang["nativeName"].toLowerCase() === String(language).toLowerCase()
    );
    if (l) {
      return l.code.toUpperCase();
    } else {
      return language;
    }
  } else {
    return null;
  }
};

const correspondingParamName = (coldLeadType) => {
  if (coldLeadType?.toLowerCase() === "coldleadsverified") {
    return "verified";
  } else if (coldLeadType?.toLowerCase() === "coldleadsinvalid") {
    return "invalid";
  } else if (coldLeadType?.toLowerCase() === "coldleadsnotchecked") {
    return "notChecked";
  } else {
    return null;
  }
};

const ColdcallFiles = ({
  lead_type,
  bulkImportRef,
  pageState,
  setpageState,
  leadCategory,
}) => {
  const [filesLoading, setFilesLoading] = useState(true);
  const [coldcallFiles, setColdcallFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const { BACKEND_URL, currentMode, primaryColor } = useStateContext();
  const [sortByVal, setSortByVal] = useState("");

  const fetchColdLeadsData = async (type) => {
    try {
      setFilesLoading(true);

      let url = BACKEND_URL + "/total-cold?";

      if(leadCategory === "hot" && lead_type === "coldleads") {
        url += `&unassigned=1&verified=1`;
      } else {
        if (type) {
          url += `&${type}=1`;
        } else {
          if(lead_type !== "all"){
            url += `&feedback=${lead_type}`;
          }
          url += `&verified=1`;
        }
      }

      const token = localStorage.getItem("auth-token");
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = response.data?.data;
      setColdcallFiles(
        data?.map((file, index) => ({
          ...file,
          index,
        }))
      );
      setAllFiles(
        data?.map((file, index) => ({
          ...file,
          index,
        }))
      );

      setFilesLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
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

  useEffect(() => {
    if (lead_type) {
      const type = correspondingParamName(lead_type);
      setFilesLoading(true);

      fetchColdLeadsData(type);
    }
  }, [lead_type]);

  useEffect(() => {
    if (sortByVal) {
      if (sortByVal === "filename") {
        setColdcallFiles(
          [...allFiles]?.sort(
            (a, b) => a?.notes?.toUpperCase() - b?.notes?.toUpperCase()
          )
        );
      } else if (sortByVal === "date-asc") {
        setColdcallFiles(
          [...allFiles]?.sort(
            (a, b) =>
              new Date(a["DATE(creationDate)"]) -
              new Date(b["DATE(creationDate)"])
          )
        );
      } else if (sortByVal === "date-desc") {
        setColdcallFiles(
          [...allFiles]?.sort(
            (a, b) =>
              new Date(b["DATE(creationDate)"]) -
              new Date(a["DATE(creationDate)"])
          )
        );
      }
    }
  }, [sortByVal]);

  const fetchFileLeads = async (file, index) => {
    setActiveFile(index);
    try {
      setpageState((old) => ({
        ...old,
        isLoading: true,
      }));

      const currDay = file["DATE(creationDate)"];

const originalDate = moment(currDay);

const nextDay = originalDate.add(1, 'days');

const nextDayString = nextDay.format('YYYY-MM-DD');

      const url = `${BACKEND_URL}/coldLeads?page=1&perpage=${
        pageState.perpage || 14
      }&coldCall=1&notes=${file?.notes}&date_range=${currDay},${nextDayString}`;

      const result = await axiosInstance.get(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth-token"),
        },
      });
      let total = result.data.coldLeads.total;

      let rowsDataArray = "";
      if (result.data.coldLeads.current_page > 1) {
        const theme_values = Object.values(result.data.coldLeads.data);
        rowsDataArray = theme_values;
      } else {
        rowsDataArray = result.data.coldLeads.data;
      }

      let filteredData = rowsDataArray;
      let rowsdata = filteredData.map((row, index) => ({
        id:
          pageState.page > 1
            ? pageState.page * pageState.pageSize -
              (pageState.pageSize - 1) +
              index
            : index + 1,
        leadId: row?.id,
        creationDate: row?.creationDate,
        transferredDate: row?.transferredDate,
        transferredFrom: row?.transferredFrom,
        transferredFromName: row?.transferredFromName,
        leadName: row?.leadName || "-",
        leadContact: row?.leadContact?.replaceAll(" ", "") || "-",
        leadEmail: row?.leadEmail || "-",
        project: row?.project || "-",
        ip: row?.ip,
        enquiryType: row?.enquiryType || "-",
        leadType: row?.leadType || "-",
        assignedToManager: row?.assignedToManager || null,
        assignedToSales: row?.assignedToSales || null,
        feedback: row?.feedback || null,
        priority: row?.priority || null,
        language: getLangCode(row?.language) || "-",
        leadSource: row?.leadSource || "-",
        is_blocked: row?.is_blocked,
        lid: row?.lid || "-",
        firstAssigned: row?.firstAssigned || "",
        transferRequest: row?.transferRequest || "",
        lastEdited: row?.lastEdited || "-",
        leadFor: row?.leadFor || "-",
        leadStatus: row?.leadStatus || "-",
        leadCategory: leadCategory || "-",
        coldCall: row?.coldcall,
        meet_link: row?.meet_link || "",
        admin_link: row?.admin_link || "",
        notes: row?.notes || "",
        otp:
          row?.otp === "No OTP" || row?.otp === "No OTP Used"
            ? "No OTP Used"
            : row?.otp || "No OTP Used",
        edit: "edit",
      }));

      setpageState((old) => ({
        ...old,
        isLoading: false,
        data: rowsdata,
        pageSize: result.data.coldLeads.per_page,
        from: result.data.coldLeads.from,
        to: result.data.coldLeads.to,
        total: total,
      }));
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
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
  return (
    <>
      {filesLoading ? (
        <div className="flex w-full justify-center items-center py-8 mt-4">
          <h1 className="text-xl">Loading...</h1>
        </div>
      ) : coldcallFiles?.length > 0 ? (
        <div>
          <div className="flex justify-end items-center">
            <Button
              onClick={() => bulkImportRef.current.click()}
              className={` text-white uppercase rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
              ripple="true"
              size="lg"
              style={{
                color: "white",
              }}
              type="submit"
            >
              Upload File
            </Button>
            <Box
              className="ml-2"
              sx={{
                width: "100px",
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  label={"Sorty By"}
                  id="sort-by"
                  value={sortByVal}
                  className={`w-full px-3`}
                  onChange={(event) => {
                    setSortByVal(event.target.value);
                  }}
                  displayEmpty
                  size="small"
                  required
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: currentMode === "dark" ? "white" : "black",
                    },
                    "& .MuiSelect-select": {
                      color: currentMode === "dark" ? "white" : "black",
                    },
                    "&:hover:not (.Mui-disabled):before": {
                      borderColor: currentMode === "dark" ? "white" : "black",
                    },
                  }}
                >
                  {/* <MenuItem selected disabled value="">Sort by</MenuItem> */}

                  <MenuItem value="filename">Filename</MenuItem>
                  <MenuItem value="date-asc">Date (Ascending Order)</MenuItem>
                  <MenuItem value="date-desc">Date (Descending Order)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div
            className="flex items-center gap-x-1 mt-4 overflow-x-scroll py-8"
            style={{ whiteSpace: "nowrap" }}
          >
            {coldcallFiles?.map((file) => {
              return (
                <div
                  className={`px-5 shadow-lg mr-2 rounded-lg py-3 inline-block ${
                    file?.index === activeFile && "border border-primary"
                  }`}
                  onClick={() => fetchFileLeads(file, file?.index)}
                >
                  <Badge
                  max={5000}
                    badgeContent={file?.total || 0}
                    sx={{
                      "& .MuiBadge-badge": {
                        background: primaryColor,
                        color: "white",
                      },
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <FaRegFileAlt size={34} className="mb-2" />
                      <p>{file?.notes}</p>
                      <p>{file["DATE(creationDate)"]}</p>
                    </div>
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-5 mt-4">
          Nothing yet
        </div>
      )}
    </>
  );
};

export default ColdcallFiles;
