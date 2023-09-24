import { useState, useRef } from "react";
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
import imageCompression from "browser-image-compression";

import { useStateContext } from "../../context/ContextProvider";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SelectImagesModal = ({ fetchSingleListing, selectImagesModal, handleClose }) => {
  const { currentMode, BACKEND_URL, User } = useStateContext();
  const imagesInputRef = useRef(null);
  const [btnloading, setbtnloading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [allImages, setAllImages] = useState([]);

  const handleSelectImages = (e) => {
    e.preventDefault();
    let AllFiles = [...e.target.files];
    const imageURLs = [];
    AllFiles.forEach((file) => {
      imageURLs.push(URL.createObjectURL(file)?.toString());
    });

    setAllImages(AllFiles);
    setImagePreviews(imageURLs);
  };

  const handleUploadImages = async () => {
    try {
      setbtnloading(true);
      const imageData = new FormData();

      imageData.append("id", selectImagesModal?.listingId);
      imageData.append("listingID", selectImagesModal?.listingId);
      // const options = {
      //   maxSizeMB: 1,
      //   maxWidthOrHeight: 1920,
      // };

      // const promises = allImages.map((img) => {
      //   return imageCompression(img, options);
      // })

      // const responses = await Promise.all(promises);

      allImages.forEach((file) => {
        imageData.append("files", file);
      })

      const response = await axios.post(
        "http://idxdubai.com:8000/api/uploadimage",
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const links = response?.data?.file_links;

      const LeadData = new FormData();
      
      const token = localStorage.getItem("auth-token");
      const listing = await axios.get(`${BACKEND_URL}/listings/${selectImagesModal?.listingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const prevImages  = listing?.data?.data[0]?.pictures || "";

      LeadData.append("pictures", links.join(",") + ", " + prevImages);

      await axios
        .post(
          `${BACKEND_URL}/listings/${selectImagesModal?.listingId}`,
          LeadData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((result) => {
          setbtnloading(false);
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
          fetchSingleListing();
          handleClose();
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
    <Modal
      keepMounted
      open={selectImagesModal?.isOpen}
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
          <h1 className="font-semibold text-lg">Upload Image(s)</h1>
        </div>

        <div className="flex flex-wrap mb-5">
          {imagePreviews?.map((preview) => {
            return (
              <img
                src={preview}
                alt=""
                className="w-[100px] mr-3 rounded object-cover h-[100px]"
                key={preview}
              />
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            disabled={btnloading}
            onClick={() => {
              if (allImages?.length === 0) {
                imagesInputRef.current?.click();
              } else {
                handleUploadImages();
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
              <span>{allImages?.length === 0 ? "Upload" : "Submit"}</span>
            )}
          </Button>
        </div>
        <input
          type="file"
          alt=""
            multiple
          hidden
          ref={imagesInputRef}
          onInput={handleSelectImages}
        />
      </div>
    </Modal>
  );
};

export default SelectImagesModal;
