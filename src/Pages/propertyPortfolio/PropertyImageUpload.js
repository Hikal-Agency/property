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
import { AiOutlinePlus } from "react-icons/ai";
import axios from "../../axoisConfig";

import { useStateContext } from "../../context/ContextProvider";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const PropertyImageUpload = ({
  selectImagesModal,
  handleClose,
  allImages,
  setAllImages,
  update,
}) => {
  const { currentMode, BACKEND_URL } = useStateContext();

  const imagesInputRef = useRef(null);
  const [btnloading, setbtnloading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  console.log("all images in child: ", allImages);

  const handleSelectImages = (e) => {
    e.preventDefault();
    const selectedFiles = [...e.target.files];

    if (selectedFiles.length + allImages.length > 10) {
      // Check for the maximum number of images
      toast.error("You can upload a maximum of 10 images.");
      return;
    }

    const imageURLs = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      imageURLs.push(URL.createObjectURL(file)?.toString());
    }

    setAllImages([...allImages, ...selectedFiles]);
    setImagePreviews([...imagePreviews, ...imageURLs]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...allImages];
    updatedImages.splice(index, 1);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);

    setAllImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleUploadImages = async () => {
    try {
      setbtnloading(true);

      // Simulate image uploading delay (remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // const options = {
      //   maxSizeMB: 1,
      //   maxWidthOrHeight: 1920,
      // };

      const ImageData = new FormData();
      ImageData.append("id", selectImagesModal?.listingId);

      // allImages?.forEach((image) => {
      //   ImageData.append("img_name", image);
      // })

      allImages.forEach((image, index) => {
        ImageData.append(`images[${index}]`, image);
      });

      const token = localStorage.getItem("auth-token");
      await axios
        .post(
          `${BACKEND_URL}/projects/${selectImagesModal?.listingId}`,
          ImageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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

  const handleAddMoreImages = () => {
    if (allImages.length < 10) {
      imagesInputRef.current?.click();
    } else {
      toast.error("You can upload a maximum of 10 images.");
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
          <h1
            className={`font-semibold text-lg ${
              currentMode === "dark" ? "text-white" : "text-dark"
            }`}
          >
            Upload Image(s)
          </h1>
        </div>

        <div className="flex">
          <div className="flex flex-wrap mb-5">
            {imagePreviews?.map((preview, index) => (
              <>
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt=""
                    className="w-[100px] mr-3 rounded object-cover h-[100px]"
                  />
                  <IconButton
                    className="absolute top-0 right-0"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <IoMdClose
                      size={18}
                      color={currentMode === "dark" ? "#ffffff" : "#000000"}
                    />
                  </IconButton>
                </div>
              </>
            ))}
          </div>

          {allImages?.length > 0 && allImages?.length < 10 ? (
            <div>
              <IconButton
                className=""
                disabled={btnloading}
                onClick={handleAddMoreImages}
              >
                <AiOutlinePlus
                  size={18}
                  color={currentMode === "dark" ? "#ffffff" : "#000000"}
                />
              </IconButton>
            </div>
          ) : // <div className="flex">
          //   <Button
          //     disabled={btnloading}
          //     onClick={handleAddMoreImages}
          //     variant="contained"
          //     // style={{
          //     //   color: "black",
          //     // }}
          //     className="bg-btn-primary text-primary px-8"
          //   >
          //     Add More Images
          //   </Button>
          // </div>
          null}
        </div>

        <div className="flex justify-center">
          <Button
            disabled={btnloading}
            onClick={() => {
              if (allImages?.length === 0) {
                imagesInputRef.current?.click();
              } else {
                // if (update) {
                //   handleUploadImages();
                // }
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
              <span>{allImages?.length === 0 ? "Upload" : "Select"}</span>
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

export default PropertyImageUpload;
