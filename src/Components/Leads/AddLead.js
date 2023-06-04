import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

const AddLead = () => {
  const { currentMode, setopenBackDrop } = useStateContext();
  const [PropertyType, setPropertyType] = useState("");
  const [EnquiryType, setEnquiryType] = useState("");
  const [ForType, setForType] = useState("");
  const [LanguagePrefered, setLanguagePrefered] = useState("");
  const [LeadStatus, setLeadStatus] = useState("");
  const [LeadSource, setLeadSource] = useState("");
  const [Feedback, setFeedback] = useState("");
  const [Manager, setManager] = useState("");
  const [SalesPerson, setSalesPerson] = useState("");

  const ChangePropertyType = (event) => {
    setPropertyType(event.target.value);
  };
  const ChangeEnquiryType = (event) => {
    setEnquiryType(event.target.value);
  };
  const ChangeForType = (event) => {
    setForType(event.target.value);
  };
  const ChangeLanguagePrefered = (event) => {
    setLanguagePrefered(event.target.value);
  };
  const ChangeLeadStatus = (event) => {
    setLeadStatus(event.target.value);
  };
  const ChangeLeadSource = (event) => {
    setLeadSource(event.target.value);
  };
  const ChangeFeedback = (event) => {
    setFeedback(event.target.value);
  };
  const ChangeManager = (event) => {
    setManager(event.target.value);
  };
  const ChangeSalesPerson = (event) => {
    setSalesPerson(event.target.value);
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <div className="pt-5 pb-5 mx-4 rounded-md sm:mx-6 lg:mx-auto ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // handleSubmitAccount();
          }}
        >
          <div className="mt-10 sm:mt-0 rounded-lg shadow-lg">
            <div className="md:grid md:grid-cols-3 md:gap-6 mt-4">
              <div className="mt-10 md:col-span-3 md:mt-0">
                <div className="overflow-hidden sm:rounded-md">
                  <div
                    className={`${
                      currentMode === "dark" ? "bg-main-dark-bg-2" : "bg-white"
                    } py-10 px-4 md:px-10 `}
                  >
                    <div className="mb-10">
                      <h3
                        className={`text-2xl font-[600] leading-6 ${
                          currentMode === "dark"
                            ? "text-white "
                            : "text-gray-900"
                        } `}
                      >
                        Add a New Lead
                      </h3>
                    </div>
                    <div className="grid grid-cols-8 gap-x-4 gap-y-5">
                      <div className="col-span-8 md:col-span-2">
                        <Select
                          id="property-type"
                          value={PropertyType}
                          label="Property Type"
                          onChange={ChangePropertyType}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            Property Type
                          </MenuItem>
                          <MenuItem value={"apartment"}>Apartment</MenuItem>
                          <MenuItem value={"villa"}>Villa</MenuItem>
                          <MenuItem value={"commercial"}>Commercial</MenuItem>
                          <MenuItem value={"townhouse"}>TownHouse</MenuItem>
                        </Select>
                      </div>
                      <div className="col-span-8 md:col-span-2">
                        <Select
                          id="enquiry"
                          value={EnquiryType}
                          label="Property Type"
                          onChange={ChangeEnquiryType}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            Enquiry
                          </MenuItem>
                          <MenuItem value={"studio"}>Studio</MenuItem>
                          <MenuItem value={"1bedroom"}>1 Bedroom</MenuItem>
                          <MenuItem value={"2bedrooms"}>2 Bedrooms</MenuItem>
                          <MenuItem value={"3bedrooms"}>3 Bedrooms</MenuItem>
                          <MenuItem value={"4bedrooms"}>4 Bedrooms</MenuItem>
                          <MenuItem value={"6bedrooms"}>5 Bedrooms</MenuItem>
                          <MenuItem value={"retail"}>Retail</MenuItem>
                          <MenuItem value={"other"}>Others</MenuItem>
                        </Select>
                      </div>

                      <div className="col-span-8 md:col-span-2">
                        <TextField
                          id="Project"
                          type={"text"}
                          label="Project Name"
                          className="w-full"
                          variant="outlined"
                          size="medium"
                          required
                        />
                      </div>
                      <div className="col-span-8 md:col-span-2">
                        <Select
                          id="for"
                          value={ForType}
                          label="Property Type"
                          onChange={ChangeForType}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            For
                          </MenuItem>
                          <MenuItem value={"investment"}>Investment</MenuItem>
                          <MenuItem value={"end-user"}>End-Users</MenuItem>
                        </Select>
                      </div>
                    </div>

                    <div className="my-7 grid grid-cols-9 gap-x-4 gap-y-5">
                      <div className="col-span-9 md:col-span-3">
                        <TextField
                          id="LeadName"
                          type={"text"}
                          label="Lead Name"
                          className="w-full"
                          variant="outlined"
                          size="medium"
                          required
                        />
                      </div>
                      <div className="col-span-9 md:col-span-3">
                        <TextField
                          id="LeadContactNumber"
                          type={"text"}
                          label="Lead Contact Number"
                          className="w-full"
                          variant="outlined"
                          size="medium"
                          required
                        />
                      </div>
                      <div className="col-span-9 md:col-span-3">
                        <TextField
                          id="LeadEmailAddress"
                          type={"email"}
                          label="Lead Email Address"
                          className="w-full"
                          variant="outlined"
                          size="medium"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-8 gap-x-4 gap-y-5">
                      <div className="col-span-8 md:col-span-2">
                        <Select
                          id="LanguagePrefered"
                          value={LanguagePrefered}
                          label="Language Prefered"
                          onChange={ChangeLanguagePrefered}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            Language Prefered
                          </MenuItem>
                          <MenuItem value={"arabic"}>Arabic</MenuItem>
                          <MenuItem value={"english"}>English</MenuItem>
                          <MenuItem value={"french"}>French</MenuItem>
                        </Select>
                      </div>
                      <div className="col-span-8 md:col-span-2">
                        <Select
                          id="LeadStatus"
                          value={LeadStatus}
                          label="Lead Status"
                          onChange={ChangeLeadStatus}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            Lead Status
                          </MenuItem>
                          <MenuItem value={"new"}>New</MenuItem>
                          <MenuItem value={"ongoing"}>Ongoing</MenuItem>
                          <MenuItem value={"hold"}>Hold</MenuItem>
                          <MenuItem value={"end"}>End</MenuItem>
                          <MenuItem value={"closed"}>Closed (Success)</MenuItem>
                        </Select>
                      </div>
                      <div className="col-span-8 md:col-span-2">
                        <Select
                          id="LeadSource"
                          value={LeadSource}
                          label="Lead Source"
                          onChange={ChangeLeadSource}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            Lead Source
                          </MenuItem>
                          <MenuItem value={"website"}>Website</MenuItem>
                          <MenuItem value={"propety finder"}>
                            Property Finder
                          </MenuItem>
                          <MenuItem value={"campaign"}>Campaign</MenuItem>
                          <MenuItem value={"personal"}>Personal</MenuItem>
                          <MenuItem value={"cold"}>Cold</MenuItem>
                          <MenuItem value={"campaign snapchat"}>
                            Campaign Snapchat
                          </MenuItem>
                          <MenuItem value={"campaign tiktok"}>
                            Campaign Tiktok
                          </MenuItem>
                          <MenuItem value={"campaign facebook UAE"}>
                            Campaign Facebook UAE
                          </MenuItem>
                          <MenuItem value={"campaign facebook SA"}>
                            Campaign Facebook SA
                          </MenuItem>
                          <MenuItem value={"campaign facebook IQ"}>
                            Campaign Facebook IQ
                          </MenuItem>
                        </Select>
                      </div>

                      <div className="col-span-8 md:col-span-2">
                        <Select
                          id="Feedback"
                          value={Feedback}
                          label="Feedback"
                          onChange={ChangeFeedback}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            Feedback
                          </MenuItem>
                          <MenuItem value={"new"}>New</MenuItem>
                        </Select>
                      </div>
                    </div>
                    <div className="my-7 grid grid-cols-9 gap-x-4 gap-y-5">
                      <div className="col-span-9 md:col-span-3">
                        <Select
                          id="Manager"
                          value={Manager}
                          label="Manager"
                          onChange={ChangeManager}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            Manager
                          </MenuItem>
                          <MenuItem value={"IT Administration"}>
                            IT Administration
                          </MenuItem>
                          <MenuItem value={"Mohamed Hikal"}>
                            Mohamed Hikal
                          </MenuItem>
                          <MenuItem value={"Nada Amin"}>Nada Amin</MenuItem>
                          <MenuItem value={"Hakem"}>Hakem</MenuItem>
                          <MenuItem value={"Belal Hikal"}>Belal Hikal</MenuItem>
                          <MenuItem value={"Hossam Hassan"}>
                            Hossam Hassan
                          </MenuItem>
                          <MenuItem value={"Hamza Alavi"}>Hamza Alavi</MenuItem>
                          <MenuItem value={"Siham Ezzine"}>
                            Siham Ezzine
                          </MenuItem>
                          <MenuItem value={"Kareem"}>Kareem</MenuItem>
                          <MenuItem value={"Nina Hikal"}>Nina Hikal</MenuItem>
                          <MenuItem value={"Mahmoud Zreik"}>
                            Mahmoud Zreik
                          </MenuItem>
                          <MenuItem value={"Bahia Benzyat"}>
                            Bahia Benzyat
                          </MenuItem>
                          <MenuItem value={"Saad Bukhari"}>
                            Saad Bukhari
                          </MenuItem>
                        </Select>
                      </div>
                      <div className="col-span-9 md:col-span-3">
                        <Select
                          id="SalesPerson"
                          value={SalesPerson}
                          label="SalesPerson"
                          onChange={ChangeSalesPerson}
                          size="medium"
                          className="w-full"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            SalesPerson
                          </MenuItem>
                        </Select>
                      </div>
                      <div className="col-span-9 md:col-span-3">
                        <TextField
                          id="Note"
                          type={"text"}
                          label="Note"
                          className="w-full"
                          variant="outlined"
                          size="medium"
                          required
                        />
                      </div>
                    </div>

                    <div
                      className={`mt-7 py-1 px-4 m-auto rounded-md w-max border-2 border-gray-300  ${
                        currentMode === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <FormControlLabel
                        className="select-none"
                        label=" I agree to the Terms & Conditions"
                        control={<Checkbox />}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    currentMode === "dark" ? "bg-main-dark-bg-2" : "bg-gray-50 "
                  } px-4 py-3 text-right sm:px-6`}
                >
                  <Button
                    variant="contained"
                    className="w-full font-semibold"
                    size="large"
                    type="submit"
                  >
                    ADD LEAD
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddLead;
