import { useState, useRef, useEffect } from "react";
import {
  Modal,
  Backdrop,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import axios from "../../axoisConfig";
import { HiOutlineDocument } from "react-icons/hi";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const PropertyDocModal = ({
  FetchProperty,
  documentModal,
  handleClose,
  allDocs,
  setAllDocs,
  project,
  update,
}) => {
  const { currentMode, BACKEND_URL, User } = useStateContext();
  const documentsInputRef = useRef(null);
  const [btnloading, setbtnloading] = useState(false);
  const { hasPermission } = usePermission();

  const [projectData, setprojectData] = useState({});
  const [listingLocation, setListingLocation] = useState({});

  useEffect(() => {
    if (update) {
      setprojectData({
        projectName: project?.projectName,
        developer_id: project?.developer_id,
        price: project?.price,
        projectLocation: project?.projectLocation,
        area: project?.area,
        tourLink: project?.tourlink,
        projectStatus: project?.projectStatus,
        bedrooms: project?.bedrooms || [],
        city: project?.city,
        country: project?.country,
        location: project?.location,
        addedBy: User?.id,
        images: project?.images || [],
      });

      const splitLocation = project?.latLong?.split(",");
      setListingLocation({
        lat: parseFloat(splitLocation[0]),
        lng: parseFloat(splitLocation[1]),
        addressText: project?.location || "",
      });
    }
  }, [update]);

  const handleSelectImages = (e) => {
    e.preventDefault();
    let AllFiles = [...e.target.files];

    setAllDocs(AllFiles);
  };

  const handleUploadDocs = async () => {
    try {
      setbtnloading(true);
      const lat = listingLocation?.lat;
      const lng = listingLocation?.lng;
      const location = [lat, lng].join(",");

      projectData["latLong"] = [
        listingLocation?.lat,
        listingLocation?.lng,
      ].join(",");
      projectData["location"] = listingLocation?.addressText;

      const Data = new FormData();
      if (allDocs?.length > 0) {
        // Append each document to the FormData object
        allDocs.forEach((doc, index) => {
          console.log("appending documents::: ", doc);
          Data.append(`documents[${index}]`, doc);
        });
      }

      Object.entries(projectData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            Data.append(`${key}[${index}]`, item);
          });
        } else {
          Data.append(key, value);
        }
      });

      const token = localStorage.getItem("auth-token");
      await axios
        .post(`${BACKEND_URL}/projects/${project?.id}`, Data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          setbtnloading(false);
          console.log("image uploaded :: ", result);
          toast.success("Image uploaded successfuly", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          handleClose();
          FetchProperty();
        })
        .catch((err) => {
          console.log(err);
          setbtnloading(false);
          toast.error("Something went wrong! Please Try Again", {
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
    } catch (error) {
      console.error(error);
      setbtnloading(false);
      toast.error("Something went wrong! Please try again", {
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
    <Modal
      keepMounted
      open={documentModal}
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
        style={style}
        className={`w-[calc(100%-20px)] md:w-[70%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 pt-5 rounded-md`}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 5,
            top: 2,
            zIndex: 10000,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <IoMdClose size={18} />
        </IconButton>
        <div className="flex flex-col mb-5 justify-center items-center">
          <h1
            className={`font-semibold text-lg ${
              currentMode === "dark" ? "text-white" : "text-dark"
            }`}
          >
            Upload Document(s)
          </h1>
        </div>

        <div className="mb-5">
          {allDocs?.map((preview) => {
            return (
              <div className="flex items-center mb-1">
                <HiOutlineDocument
                  className={`ml-1 ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                />
                <p
                  className={`ml-1 ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  {preview?.name}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            disabled={btnloading}
            onClick={() => {
              if (allDocs?.length === 0) {
                documentsInputRef.current?.click();
              } else {
                if (update) {
                  handleUploadDocs();
                  return;
                }
                handleClose();
              }
            }}
            variant="contained"
            style={{
              color: "white",
            }}
            className="bg-btn-primary px-8"
          >
            {btnloading ? (
              <div className="flex items-center justify-center space-x-1">
                <CircularProgress size={18} sx={{ color: "white" }} />
              </div>
            ) : (
              <span>{allDocs?.length === 0 ? "Upload" : "Select"}</span>
            )}
          </Button>
        </div>
        <input
          type="file"
          alt=""
          multiple
          hidden
          ref={documentsInputRef}
          onInput={handleSelectImages}
        />
      </div>
    </Modal>
  );
};

export default PropertyDocModal;
