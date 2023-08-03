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
  notes: "Notes",
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
  lead_origin
}) => {
  const { currentMode, BACKEND_URL, User } = useStateContext();

  const [values, setValues] = useState({});
  const [columns, setColumns] = useState(CSVData?.keys || []);
  const [btnloading, setbtnloading] = useState(false);

    let coldCallCode = "";
    if (lead_origin === "freshleads") {
      coldCallCode = 0;
    } else if (lead_origin === "coldleads") {
      coldCallCode = 1;
    } else if (lead_origin === "thirdpartyleads") {
      coldCallCode = 3;
    } else if (lead_origin === "personalleads") {
      coldCallCode = 2;
    } else if (lead_origin === "warmleads") {
      coldCallCode = 4;
    } else if (lead_origin === "transfferedleads") {
      coldCallCode = 0;
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth-token");
      const AllLeads = [];
      CSVData?.rows.forEach((row) => {
        const LeadData = {
          ...allKeys,
        };
        Object.keys(allKeys).forEach((key) => {
          const idx = CSVData?.keys.indexOf(values[key]);
          LeadData[key] = row[idx];
        });

        LeadData["leadSource"] = "Bulk Import";
        LeadData["coldCall"] = coldCallCode;
        LeadData["feedback"] = "New";
        LeadData["addedBy"] = User?.id;

        if(User?.role === 3 || User?.role === 2){
          LeadData["assignedToManager"] = User?.id;
        } else if(User?.role === 7) {
          LeadData["assignedToSales"] = User?.id;
          LeadData["assignedToManager"] = User?.isParent;
        }

        for(let key in LeadData) {
          if(!LeadData[key]) {
            delete LeadData[key];
          }
        }

        if(LeadData["leadName"] && LeadData["leadContact"]) {
          AllLeads.push(LeadData);
        }
      });

      setbtnloading(true);

    await axios
      .post(`${BACKEND_URL}/bulkimport`, JSON.stringify({
        leads: AllLeads
      }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      
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

          <form onSubmit={handleSubmit}>
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
                    required={(key === "leadName" || key === "leadContact") ? true : false}
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
              color="error"
              size="lg"
              variant="contained"
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
          </form>
        </div>
      </Modal>
    </>
  );
};

export default BulkImport;
