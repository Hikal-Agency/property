import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Tooltip,
  Drawer,
  MenuItem,
  Box,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Checkbox,
  FormGroup,
} from "@mui/material";
import Select from "react-select";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { MdClose } from "react-icons/md";
import PortfolioLocation from "./PortfolioLocation";
import PropertyImageUpload from "./PropertyImageUpload";
import PropertyDocModal from "./PropertyDocumentUpload";
import { selectStyles } from "../../Components/_elements/SelectStyles";
import {
  enquiry_options,
  project_status_options,
} from "../../Components/_elements/SelectOptions";
import MultiStepForm from "./MultiStepForm";

const AddProject = ({ openAddProject, setOpenAddProject, FetchProperty }) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    fontFam,
  } = useStateContext();

  const [allImages, setAllImages] = useState([]);
  const [allDocs, setAllDocs] = useState([]);

  console.log("imagesss:: ", allImages);

  const [listingLocation, setListingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });

  const [documentModal, setDocumentModal] = useState(false);

  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    listingId: null,
  });

  const [projectData, setprojectData] = useState({
    projectName: null,
    developer_id: null,
    price: null,
    projectLocation: null,
    area: null,
    tourLink: null,
    projectStatus: null,
    bedrooms: [],
    city: null,
    country: null,
    location: null,
    addedBy: User?.id,
    images: [],
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [developer, setDeveloper] = useState([]);
  const token = localStorage.getItem("auth-token");

  const [isClosing, setIsClosing] = useState(false);

  const handleBeds = (value) => {
    setprojectData((prev) => {
      if (prev.bedrooms.includes(value)) {
        // Remove the value from the array if already selected
        return {
          ...prev,
          bedrooms: prev.bedrooms.filter((item) => item !== value),
        };
      } else {
        // Add the value to the array if not selected
        return { ...prev, bedrooms: [...prev.bedrooms, value] };
      }
    });
  };

  const handleChange = (e) => {
    const data = e.target.value;
    const name = e.target.name;

    console.log("data,name:: ", data, name);

    setprojectData((prev) => ({
      ...prev,
      [name]: data,
    }));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenAddProject(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const getDevelopers = () => {
    setLoading(true);
    const token = localStorage.getItem("auth-token");

    axios
      .get(`${BACKEND_URL}/dev-with-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setDeveloper(result?.data?.data?.developers);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error("Unable to fetch developers.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  console.log("Project data::: ", projectData);
  // const AddDeveloper = () => {
  //   setBtnLoading(true);

  //   if (
  //     !projectData?.projectName ||
  //     !projectData?.projectLocation ||
  //     !projectData?.area ||
  //     !projectData?.developer_id
  //   ) {
  //     setBtnLoading(false);
  //     toast.error("Kindly fill all the required fields.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });

  //     return;
  //   }

  //   projectData["latLong"] = [listingLocation?.lat, listingLocation?.lng].join(
  //     ","
  //   );
  //   projectData["location"] = listingLocation?.addressText;

  //   // if (allImages?.length > 0)
  //   //   allImages?.forEach((image, index) => {
  //   //     console.log("i am image: ", image);
  //   //     // LeadData.append(`img_name[${index}]`, image);
  //   //   });

  //   if (allImages?.length > 0) {
  //     projectData["images"] = [...allImages];
  //     console.log("all images sending :", [...allImages]);
  //   }

  //   axios
  //     .post(`${BACKEND_URL}/projects`, projectData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     })
  //     .then((result) => {
  //       console.log("Result: ");
  //       console.log("Result: ", result);
  //       setBtnLoading(false);
  //       setprojectData({
  //         projectName: "",
  //         developer_id: "",
  //         price: "",
  //         projectLocation: "",
  //         area: "",
  //         tourLink: "",
  //         projectStatus: "",
  //         bedrooms: "",
  //         city: "",
  //         country: "",
  //         location: "",
  //         addedBy: User?.id,
  //       });
  //       toast.success("Project added successfully.", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });

  //       setOpenAddProject(false);
  //       FetchProperty(token);
  //     })
  //     .catch((err) => {
  //       setBtnLoading(false);
  //       console.log(err);
  //       toast.error("Soemthing Went Wrong! Please Try Again", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     });
  // };

  const AddDeveloper = () => {
    setBtnLoading(true);

    if (
      !projectData?.projectName ||
      !projectData?.projectLocation ||
      !projectData?.area ||
      !projectData?.developer_id
    ) {
      setBtnLoading(false);
      toast.error("Kindly fill all the required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    projectData["latLong"] = [listingLocation?.lat, listingLocation?.lng].join(
      ","
    );
    projectData["location"] = listingLocation?.addressText;

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    if (allImages?.length > 0) {
      // Append each image to the FormData object
      allImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    if (allDocs?.length > 0) {
      // Append each document to the FormData object
      allDocs.forEach((doc, index) => {
        formData.append(`documents[${index}]`, doc);
      });
    }

    Object.entries(projectData).forEach(([key, value]) => {
      // Check if the value is an array (e.g., bedrooms)
      if (Array.isArray(value)) {
        // Loop through the array and append each value separately
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        // Append non-array values directly
        formData.append(key, value);
      }
    });

    // formData.append("projectName", projectData?.projectName);
    // formData.append("developer_id", projectData?.developer_id);
    // formData.append("price", projectData?.price);
    // formData.append("projectLocation", projectData?.projectLocation);
    // formData.append("area", projectData?.area);
    // formData.append("tourLink", projectData?.tourLink);
    // formData.append("projectStatus", projectData?.projectStatus);
    // formData.append("bedrooms", projectData?.bedrooms);
    // formData.append("city", projectData?.city);
    // formData.append("country", projectData?.country);
    // formData.append("addedBy", projectData?.addedBy);
    // formData.append("location", projectData?.location);

    axios
      .post(`${BACKEND_URL}/projects`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setBtnLoading(false);
        setprojectData({
          projectName: "",
          developer_id: "",
          price: "",
          projectLocation: "",
          area: "",
          tourLink: "",
          projectStatus: "",
          bedrooms: "",
          city: "",
          country: "",
          location: "",
          addedBy: User?.id,
        });
        toast.success("Project added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setOpenAddProject(false);
        FetchProperty(token);
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        toast.error("Something Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    // getDevelopers();
  }, []);

  const options = enquiry_options(t);

  return (
    <>
      <Modal
        keepMounted
        open={openAddProject}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        openAfterTransition
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
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
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            {loading ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="w-full">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      AddDeveloper();
                    }}
                    disabled={loading ? true : false}
                  >
                    <div className="w-full flex items-center pb-3">
                      <div className="bg-primary h-10 w-1 rounded-full"></div>
                      <h1
                        className={`text-lg font-semibold mx-2 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {t("add_project_modal")}
                      </h1>
                    </div>

                    <div className={`w-full p-4`}>
                      {/* <Box
                        sx={{
                          ...darkModeColors,
                          "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                            {
                              right: isLangRTL(i18n.language)
                                ? "2.5rem"
                                : "inherit",
                              transformOrigin: isLangRTL(i18n.language)
                                ? "right"
                                : "left",
                            },
                          "& legend": {
                            textAlign: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        }}
                      > */}
                      <MultiStepForm />
                      {/* </Box> */}

                      {/* <div className="mt-4">
                        <Button
                          className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                          ripple={true}
                          style={{
                            fontFamily: fontFam,
                            background: `${primaryColor}`,
                          }}
                          size="lg"
                          type="submit"
                          disabled={btnLoading ? true : false}
                        >
                          {btnLoading ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                              className="text-white"
                            />
                          ) : (
                            <span className="text-white">
                              {t("submit_project_btn")}
                            </span>
                          )}
                        </Button>
                      </div> */}
                    </div>
                  </form>
                </div>
                {selectImagesModal?.isOpen && (
                  <PropertyImageUpload
                    selectImagesModal={selectImagesModal}
                    handleClose={() => setSelectImagesModal({ isOpen: false })}
                    allImages={allImages}
                    setAllImages={setAllImages}
                  />
                )}
                {documentModal && (
                  <PropertyDocModal
                    documentModal={documentModal}
                    handleClose={() => setDocumentModal(false)}
                    allDocs={allDocs}
                    setAllDocs={setAllDocs}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddProject;
