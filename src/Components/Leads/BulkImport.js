import { useState, useEffect } from "react";
import moment from "moment";
import {
  Modal,
  Backdrop,
  IconButton,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";
// import axios from "axios";
import axios from "../../axoisConfig";
import { toast, ToastContainer } from "react-toastify";

const allKeys = {
  leadName: "Lead Name",
  leadContact: "Lead Contact",
  leadEmail: "Lead Email",
  enquiryType: "Enquiry Type",
  leadType: "Lead Type",
  project: "Project",
  leadFor: "Lead For",
  language: "Language",
  leadStatus: "Lead Status",
  leadSource: "Lead Source",
  feedback: "Feedback",
  notes: "Notes",
  assignedToManager: "Assigned To Manager",
  assignedToSales: "Assigned To Sales",
};

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  height: "90%",
  overflowY: "scroll",
};

const BulkImport = ({
  bulkImportModelOpen,
  handleCloseBulkImportModel,
  CSVData,
  FetchLeads,
}) => {
  const { currentMode, BACKEND_URL } = useStateContext();

  const [values, setValues] = useState({});
  const [columns, setColumns] = useState(CSVData?.keys || []);
  const [btnloading, setbtnloading] = useState(false);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const urls = CSVData?.rows.map((row) => {
        const LeadData = {
          ...allKeys,
        };
        Object.keys(allKeys).forEach((key) => {
          const idx = CSVData?.keys.indexOf(values[key]);
          LeadData[key] = row[idx];
        });
        return axios.post(`${BACKEND_URL}/leads`, JSON.stringify(LeadData), {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
      });
      setbtnloading(true);
      await Promise.all(urls);
      toast.success("Leads Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
      FetchLeads(token);
      handleCloseBulkImportModel();
    } catch (error) {
      console.log(error);
      toast.error("Error in Adding Leads", {
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

  const handleChange = (event, colName) => {
    const value = event.target.value;
    const updatedValues = { ...values, [colName]: value };
    setValues(updatedValues);
  };

  return (
    <>
      <Modal
        keepMounted
        open={bulkImportModelOpen}
        onClose={handleCloseBulkImportModel}
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
          className={`w-[calc(100%-20px)] md:w-[40%] ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
        >
          <ToastContainer />
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleCloseBulkImportModel}
          >
            <IoMdClose size={18} />
          </IconButton>

          {Object.keys(allKeys).map((key) => {
            return (
              <>
                <label htmlFor={key}>{allKeys[key]}</label>
                <Select
                  id={key}
                  value={values[key] || ""}
                  onChange={(event) => handleChange(event, key)}
                  size="medium"
                  className="w-full mb-5 mt-1"
                  required
                >
                  <MenuItem value="" disabled>
                    Select Column
                  </MenuItem>

                  {columns?.map((col, index) => (
                    <MenuItem
                      key={index}
                      disabled={Object.values(values).includes(col)}
                      value={col}
                    >
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </>
            );
          })}

          <Button
            className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
            ripple={"true"}
            size="lg"
            variant="contained"
            onClick={handleSubmit}
            type="submit"
            disabled={btnloading ? true : false}
          >
            {btnloading ? (
              <div className="flex items-center justify-center space-x-1">
                <CircularProgress size={18} sx={{ color: "blue" }} />
              </div>
            ) : (
              <span>Add Leads</span>
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BulkImport;
