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
import { HiOutlineDocument } from "react-icons/hi";

import { useStateContext } from "../../context/ContextProvider";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SelectDocumentModal = ({
  fetchSingleListing,
  selectDocumentModal,
  handleClose,
}) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const documentsInputRef = useRef(null);
  const [allDocs, setAllDocs] = useState([]);
  const [btnloading, setbtnloading] = useState(false);

  const handleSelectImages = (e) => {
    e.preventDefault();
    let AllFiles = [...e.target.files];

    setAllDocs(AllFiles);
  };

  const handleUploadDocs = async () => {
    try {
      setbtnloading(true);

      // Simulate image uploading delay (remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const DocData = new FormData();

      // allDocs?.forEach((doc) => {
      //   DocData.append("doc_name", doc);
      // })

      allDocs?.forEach((doc, index) => {
        DocData.append(`doc_name[${index}]`, doc);
      });

      const token = localStorage.getItem("auth-token");
      await axios
        .post(
          `${BACKEND_URL}/listings/${selectDocumentModal?.listingId}`,
          DocData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((result) => {
          setbtnloading(false);
          toast.success("Document is uploaded successfuly", {
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
      open={selectDocumentModal?.isOpen}
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
        } absolute top-1/2 left-1/2 p-5 pt-5 rounded-md border border-[#AAAAAA] border-1`}
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
                handleUploadDocs();
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
              <span>{allDocs?.length === 0 ? "Upload" : "Submit"}</span>
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

export default SelectDocumentModal;
