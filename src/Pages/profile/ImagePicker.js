import { useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
// import axios from "axios";
import axios from "../../axoisConfig";
import {
  Modal,
  Backdrop,
  IconButton,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { BiImageAdd } from "react-icons/bi";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const ImagePicker = ({ imagePickerModal, setImagePickerModal }) => {
  const { BACKEND_URL, currentMode, setUser } = useStateContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnloading, setbtnloading] = useState(false);
  const pickerRef = useRef();

  const cropperRef = useRef();

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    console.log(e.target.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setSelectedFile(files[0]);
    };
    reader.readAsDataURL(files[0]);
  };

  const SetUserProfilePic = (url) => {
    setUser((user) => ({
      ...user,
      displayImg: url,
    }));
    const localStorageUser = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...localStorageUser,
        displayImg: url,
      })
    );
  };

  const UpdateProfileImage = async (img) => {
    try {
      const token = localStorage.getItem("auth-token");
      const imageData = new FormData();
      imageData.append("image", img);
      setbtnloading(true);
      const result = await axios.post(
        `${BACKEND_URL}/user/profile-picture`,
        imageData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(result.data);
      setImagePickerModal({ isOpen: false });
      setbtnloading(false);
      toast.success("Profile Picture Updated Successfuly!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      SetUserProfilePic(result.data.url);
    } catch (err) {
      setbtnloading(false);
      console.error(err);
      toast.error("Error in Updating Profile Image", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleClickUpload = () => {
    pickerRef.current.click();
  };

  function srcToFile(src, fileName, mimeType) {
    return fetch(src)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], fileName, { type: mimeType });
      });
  }

  const getCropData = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const src = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
      const file = await srcToFile(src, selectedFile.name, selectedFile.type);
      console.log(file);
      UpdateProfileImage(file);
    }
  };

  return (
    <div>
      <Modal
        keepMounted
        open={imagePickerModal.isOpen}
        onClose={() => setImagePickerModal({ isOpen: false })}
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
          className={`w-[calc(100%-20px)] image-picker flex flex-col items-center justify-center outline-4 outline-white outline-dashed md:w-[60%] md:h-[70%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              zIndex: 10000,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setImagePickerModal({ isOpen: false })}
          >
            <IoMdClose size={18} />
          </IconButton>
          {btnloading && (
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar"
                style={{
                  background: `radial-gradient(closest-side, white 79%, transparent 80% 100%),
    conic-gradient(hotpink ${uploadProgress}%, pink 0)`,
                }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
          {!selectedImage && (
            <>
              <BiImageAdd size={70} color="grey" />
              <Button
                onClick={handleClickUpload}
                variant="contained"
                sx={{ py: 1, mt: 5 }}
                color="info"
              >
                Upload Image
              </Button>
              <input
                ref={pickerRef}
                type="file"
                id="pick-image"
                accept="image/*"
                hidden
                onInput={onChange}
              />
            </>
          )}
          {selectedImage && (
            <Box className="relative w-[90%] h-[80%] mt-2 flex flex-col items-center">
              <Cropper
                ref={cropperRef}
                style={{ width: "100%", height: "80%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                src={selectedImage}
                aspectRatio={1}
                viewMode={1}
                minCropBoxHeight={50}
                minCropBoxWidth={50}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
              />

              <Button
                onClick={getCropData}
                sx={{ mt: 5 }}
                size="large"
                variant="contained"
              >
                {btnloading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  <span>done</span>
                )}
              </Button>
            </Box>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ImagePicker;
