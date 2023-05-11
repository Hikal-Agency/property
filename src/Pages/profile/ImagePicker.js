import { useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import { Modal, Backdrop, IconButton, Button, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { BiImageAdd } from "react-icons/bi";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24
};

const ImagePicker = ({ imagePickerModal, setImagePickerModal }) => {
  const { BACKEND_URL, currentMode } = useStateContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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

    console.log("%cSelected Image: ", 'background-color: green');
    console.log(e.target.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setSelectedFile(files[0]);
    };
    reader.readAsDataURL(files[0]);
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
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    console.log("%cImage Result: ", 'background-color: purple');
    console.log(result.data);
      setImagePickerModal({isOpen: false});
      setbtnloading(false);
    } catch (err) {
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


  function srcToFile(src, fileName, mimeType){
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    );
}

  const getCropData = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const src = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
      const file = await srcToFile(src, selectedFile.name, selectedFile.type);
    console.log("%cCropped Image: ", 'background-color: blue');
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
          className={`w-[calc(100%-20px)] flex flex-col items-center justify-center outline-4 outline-white outline-dashed md:w-[60%] md:h-[70%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setImagePickerModal({ isOpen: false })}
          >
            <IoMdClose size={18} />
          </IconButton>
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
                  style={{width: "100%", height: "80%"}}
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

                <Button onClick={getCropData} sx={{mt: 5}} size="large" variant="contained">
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
