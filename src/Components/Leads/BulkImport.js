import { useEffect, useState } from "react";
import {
  Modal,
  Backdrop,
  IconButton,
  // Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import Select from "react-select";
import { useStateContext } from "../../context/ContextProvider";
import countries from "country-list";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { selectStyles } from "../_elements/SelectStyles";
import { PrimaryButton } from "@react-pdf-viewer/core";

const allKeys = {
  leadName: "Lead Name",
  leadContact: "Lead Contact",
  leadEmail: "Lead Email",
  enquiryType: "Enquiry Type",
  leadType: "Lead Type",
  project: "Project",
  leadFor: "Lead For",
  language: "Language",
  leadSource: "Lead Source",
  notes: "Notes",
  country: "Country",
};

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const BulkImport = ({
  bulkImportModelOpen,
  handleCloseBulkImportModel,
  CSVData,
  FetchLeads,
  lead_origin,
}) => {
  const { 
    currentMode, 
    BACKEND_URL, 
    User, 
    fetchSidebarData,
    isLangRTL,
    i18n, t,
    primaryColor
  } =
    useStateContext();

  const [values, setValues] = useState({}); 
  const [columns, setColumns] = useState(CSVData?.keys || []);
  const [countryInputVal, setCountryInputVal] = useState("");
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
        console.log(LeadData);

        if (LeadData["leadSource"]) {
          // DO NOTHING 
        }
        else {
          LeadData["leadSource"] = "Bulk Import";
        }
        LeadData["coldCall"] = coldCallCode;
        LeadData["feedback"] = "New";
        LeadData["addedBy"] = User?.id;

        if (coldCallCode === 1) {
          LeadData["notes"] = CSVData?.fileName; 
        }
        else {
          if (LeadData["notes"]) {
            // DO NOTHING 
          }
          else {
            LeadData["notes"] = CSVData?.fileName; 
          }
        }

        if(countryInputVal?.trim()) {
          LeadData["country"] = countryInputVal?.trim();
        }

        if (User?.role === 3 || User?.role === 2) {
          LeadData["assignedToManager"] = User?.id;
        } else if (User?.role === 7) {
          LeadData["assignedToSales"] = User?.id;
          LeadData["assignedToManager"] = User?.isParent;
        }

        for (let key in LeadData) {
          if (!LeadData[key]) {
            delete LeadData[key];
          }
        }

        if (LeadData["leadName"] && LeadData["leadContact"]) {
          AllLeads.push(LeadData);
        }
      });

      setbtnloading(true);

      await axios.post(
        `${BACKEND_URL}/bulkimport`,
        JSON.stringify({
          leads: AllLeads,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      fetchSidebarData();
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
    const value = event;
    const updatedValues = { ...values, [colName]: value };
    setValues(updatedValues);
  };

  useEffect(() => {
    console.log("VALUES ============== ", values);
  }, [handleChange]);

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseBulkImportModel();
    }, 1000);
  };

  return (
    <>
      <Modal
        keepMounted
        open={bulkImportModelOpen}
        onClose={handleClose}
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
            } ${currentMode === "dark" && (isLangRTL(i18n.language) ? "border-r-2 border-primary" : "border-l-2 border-primary")}
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            <div className="w-full flex items-center pb-3 mb-3">
              <div className="bg-primary h-10 w-1 rounded-full my-1"></div>
              <h1
                className={`text-lg font-semibold mx-2 ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {t("source_bulk_import")}
              </h1>
            </div>
            
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <form onSubmit={handleSubmit}>
                {/* COUNTRY  */}
                <div className="flex flex-col p-1 gap-3">
                  <label htmlFor={"countries"}>
                    {t("label_country")}
                  </label>
                  <Select
                    id="countries"
                    value={countryInputVal
                      ? {
                        label: countryInputVal,
                        value: countryInputVal
                      }
                      : {
                        label: "---SELECT---",
                        value: ""
                      }
                    }
                    onChange={(event) => setCountryInputVal(event ? event.value : "")}
                    options={countries.getNames()?.map((country) => ({
                      label: country,
                      value: country
                    }))}
                    // placeholder={t("label_country")}
                    placeholder=""
                    className="w-full"
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                </div>
                {/* OTHER FIELDS  */}
                {Object.keys(allKeys).map((key) => (
                  <div key={key} className="flex flex-col p-1 gap-3">
                    <label htmlFor={key}>
                      {allKeys[key]}
                    </label>
                    <Select
                      id={key}
                      value={values[key]
                        ? {
                          value: values[key],
                          label: values[key]
                        }
                        : null
                      }
                      onChange={(selectedOption) => handleChange(selectedOption.value, key)}
                      options={columns?.map((col) => ({
                        label: col,
                        value: col,
                      }))}
                      // placeholder={allKeys[key]}
                      placeholder=""
                      className="w-full"
                      menuPortalTarget={document.body}
                      required={key === "leadName" || key === "leadContact"}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                  </div>
                ))}
                {/* BUTTON  */}
                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
                  ripple={"true"}
                  color="error"
                  size="lg"
                  variant="contained"
                  style={{
                    color: "white"
                  }}
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

              <div className="p-4">
                <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"}
                  rounded-xl shadow-sm p-4 w-full h-fit`}>
                    <div className="text-center p-4 uppercase">
                      {t("table_columns")}
                    </div>
                    <div className="w-full h-1 rounded-full bg-primary mb-4"></div>
                    <div className="flex flex-col gap-4 p-4">
                      {columns?.map((col, index) => (
                        <div key={index}>
                          {index + 1}.{" "}{col}
                        </div>
                      ))}
                    </div>

                </div>
              </div>
            </div>

            {/* <form onSubmit={handleSubmit}> */}
              {/* <label htmlFor={"countries"}>
                {t("label_country")}
              </label>
                <Select
                  id={"countries"}
                  value={countryInputVal || ""}
                  onChange={(event) => setCountryInputVal(event.target.value)}
                  size="medium"
                  className="w-full mb-5 mt-1"
                >
                  <MenuItem value="" disabled>
                    Select country
                  </MenuItem>
                  {countries.getNames()?.map((country, index) => (
                    <MenuItem
                      key={index}
                      value={country}
                    >
                      {country}
                    </MenuItem>
                  ))}
                </Select>
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
                      required={
                        key === "leadName" || key === "leadContact" ? true : false
                      }
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
              })} */}
              {/* <Button
                className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
                ripple={"true"}
                color="error"
                size="lg"
                variant="contained"
                style={{
                  color: "white"
                }}
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
              </Button> */}
            {/* </form> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BulkImport;
