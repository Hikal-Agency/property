import {
  Modal,
  Backdrop,
  IconButton,
  CircularProgress,
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { useStateContext } from "../../../context/ContextProvider";
import { useState } from "react";
import LocationPicker from "../../meetings/LocationPicker";
import ListingLocation from "./ListingLocation";
import { MdFileUpload } from "react-icons/md";
import { CiMapPin } from "react-icons/ci";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const AddListingModal = ({ setListingModalOpen, handleCloseListingModal }) => {
  const { currentMode, darkModeColors, User, BACKEND_URL } = useStateContext();
  const [loading, setloading] = useState(false);
  const [displayMap, setDisplayMap] = useState(false);
  const [listingLocation, setLisitingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });
  return (
    <>
      <Modal
        keepMounted
        open={setListingModalOpen}
        onClose={() => handleCloseListingModal()}
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
          className={`w-[calc(100%-20px)] h-[80%] overflow-y-scroll md:w-[50%] border-2 border-solid shadow-lg  ${
            currentMode === "dark"
              ? "bg-black border-gray-800"
              : "bg-white border-gray-200"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => handleCloseListingModal()}
          >
            <IoMdClose size={18} />
          </IconButton>

          <div className="w-full flex items-center py-1 mb-2">
            {/* <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div> */}
            <h1
              className={`text-lg bg-primary font-semibold  py-2 px-6 ${
                currentMode === "dark" ? "text-white" : "text-white"
              }`}
            >
              Secondary
            </h1>
            <h1
              className={`text-lg font-semibold ml-3 ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              Add Property
            </h1>
          </div>

          <div className="mx-auto ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // AddLead();
              }}
              disabled={loading ? true : false}
            >
              <div className="grid grid-cols-1 mt-9 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5 px-4 md:px-10 ">
                <div className="px-4">
                  <Box sx={darkModeColors}>
                    <h4
                      className={`${
                        currentMode === "dark" ? "text-primary" : "text-black"
                      } text-center font-semibold pb-5`}
                    >
                      Seller Details
                    </h4>

                    <TextField
                      id="notes"
                      type={"text"}
                      label="Legal Name"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      // value={LeadNotes}
                      // onChange={(e) => setLeadNotes(e.target.value)}
                    />
                    <TextField
                      id="notes"
                      type={"text"}
                      label="Contacts"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      // value={LeadNotes}
                      // onChange={(e) => setLeadNotes(e.target.value)}
                    />
                    <TextField
                      id="notes"
                      type={"text"}
                      label="Email"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      // value={LeadNotes}
                      // onChange={(e) => setLeadNotes(e.target.value)}
                    />
                    <TextField
                      id="notes"
                      type={"text"}
                      label="Property Price"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      // value={LeadNotes}
                      // onChange={(e) => setLeadNotes(e.target.value)}
                    />
                  </Box>
                </div>

                <div className="px-4">
                  <Box sx={darkModeColors}>
                    <h4
                      className={`${
                        currentMode === "dark" ? "text-primary" : "text-black"
                      } text-center font-semibold pb-5`}
                    >
                      Project details
                    </h4>

                    <TextField
                      id="property-type"
                      // value={PropertyType}
                      label="Property type"
                      // onChange={ChangePropertyType}
                      size="small"
                      className="w-full mb-5"
                      displayEmpty
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      select
                    >
                      <MenuItem value="" disabled>
                        Property type
                        <span className="ml-1" style={{ color: "red" }}>
                          *
                        </span>
                      </MenuItem>
                      <MenuItem value={"Apartment"}>Apartment</MenuItem>
                      <MenuItem value={"Villa"}>Villa</MenuItem>
                      <MenuItem value={"penthouse"}>Penthouse</MenuItem>
                      <MenuItem value={"mansion"}>Mansion</MenuItem>
                      <MenuItem value={"Commercial"}>Commercial</MenuItem>
                      <MenuItem value={"Townhouse"}>TownHouse</MenuItem>
                    </TextField>

                    <TextField
                      id="notes"
                      type={"text"}
                      label="Project/Name of Building"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      // value={LeadNotes}
                      // onChange={(e) => setLeadNotes(e.target.value)}
                    />

                    <TextField
                      id="enquiry"
                      label="Number Of Bedrooms"
                      // value={EnquiryType}
                      // onChange={ChangeEnquiryType}
                      size="small"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      displayEmpty
                      select
                    >
                      <MenuItem value="" disabled>
                        Enquiry about
                        <span className="ml-1" style={{ color: "red" }}>
                          *
                        </span>
                      </MenuItem>
                      <MenuItem value={"Studio"}>Studio</MenuItem>
                      <MenuItem value={"1 Bedroom"}>1 Bedroom</MenuItem>
                      <MenuItem value={"2 Bedrooms"}>2 Bedrooms</MenuItem>
                      <MenuItem value={"3 Bedrooms"}>3 Bedrooms</MenuItem>
                      <MenuItem value={"4 Bedrooms"}>4 Bedrooms</MenuItem>
                      <MenuItem value={"5 Bedrooms"}>5 Bedrooms</MenuItem>
                      <MenuItem value={"6 Bedrooms"}>6 Bedrooms</MenuItem>
                    </TextField>

                    <TextField
                      id="for"
                      // value={ForType}
                      label="Number of Bathrooms"
                      // onChange={ChangeForType}
                      size="small"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      displayEmpty
                      select
                    >
                      <MenuItem value="" disabled>
                        Number of Bathrooms
                        <span className="ml-1" style={{ color: "red" }}>
                          *
                        </span>
                      </MenuItem>
                      <MenuItem value={"1 Bathroom"}>1 Bathroom</MenuItem>
                      <MenuItem value={"2 Bathrooms"}>2 Bathrooms</MenuItem>
                      <MenuItem value={"3 Bathrooms"}>3 Bathrooms</MenuItem>
                      <MenuItem value={"4 Bathrooms"}>4 Bathrooms</MenuItem>
                      <MenuItem value={"5 Bathrooms"}>5 Bathrooms</MenuItem>
                      <MenuItem value={"6 Bathrooms"}>6 Bathrooms</MenuItem>
                    </TextField>
                  </Box>
                </div>

                <div className="px-4">
                  <Box sx={darkModeColors}>
                    <h4
                      className={`${
                        currentMode === "dark" ? "text-primary" : "text-black"
                      } text-center font-semibold pb-5`}
                    >
                      Other Details
                    </h4>

                    <TextField
                      id="LeadEmailAddress"
                      type={"text"}
                      label="Address"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      // error={emailError && emailError}
                      // helperText={emailError && emailError}
                      // value={LeadEmail}
                      // onChange={handleEmail}
                    />
                    <TextField
                      id="LeadEmailAddress"
                      type={"text"}
                      label="Area"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      // error={emailError && emailError}
                      // helperText={emailError && emailError}
                      // value={LeadEmail}
                      // onChange={handleEmail}
                    />

                    {!displayMap && (
                      <Button
                        variant="contained"
                        size="medium"
                        className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
                        style={{
                          // backgroundColor: "#111827",
                          color: "#ffffff",
                          // border: "1px solid #DA1F26",
                        }}
                        onClick={() => setDisplayMap(true)}
                        component="span"
                        disabled={loading ? true : false}
                        startIcon={loading ? null : <CiMapPin />}
                      >
                        <span>Location In Map</span>
                      </Button>
                    )}

                    {displayMap && (
                      <ListingLocation
                        listingLocation={listingLocation}
                        currLocByDefault={true}
                        setLisitingLocation={setLisitingLocation}
                      />
                    )}
                  </Box>
                </div>
              </div>

              <div className="w-full flex justify-center mr-4 items-center my-4 space-x-5">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="contained-button-file"
                  type="file"
                  // onChange={handleImgUpload}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    size="medium"
                    className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
                    style={{
                      // backgroundColor: "#111827",
                      color: "#ffffff",
                      // border: "1px solid #DA1F26",
                    }}
                    component="span"
                    disabled={loading ? true : false}
                    startIcon={loading ? null : <MdFileUpload />}
                  >
                    <span>Upload Image</span>
                  </Button>
                </label>
                <input
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: "none" }}
                  id="contained-button-document"
                  type="file"
                  // onChange={handleImgUpload}
                />
                <label htmlFor="contained-button-document">
                  <Button
                    variant="contained"
                    size="medium"
                    className="bg-main-red-color border-primary w-full text-white rounded-lg py-3 bg-btn-primary font-semibold my-3"
                    style={{
                      // backgroundColor: "#111827",
                      color: "#ffffff",
                      // border: "1px solid ",
                    }}
                    component="span"
                    disabled={loading ? true : false}
                    startIcon={loading ? null : <MdFileUpload />}
                  >
                    <span>Upload Document</span>
                  </Button>
                </label>
              </div>

              <div
                className={`${
                  currentMode === "dark" ? "bg-black" : "bg-white"
                } px-5 mx-5 py-2 text-center sm:px-6`}
              >
                <Button
                  ripple={true}
                  size="lg"
                  type="submit"
                  className="bg-btn-primary"
                  disabled={loading ? true : false}
                  style={{
                    // background: "#da1f26",
                    color: "#ffffff",
                    marginTop: "10px",
                    width: "100%",
                    borderRadius: "6px",
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: "white" }}
                      className="text-white"
                    />
                  ) : (
                    <span>Add property for secondary market</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddListingModal;
