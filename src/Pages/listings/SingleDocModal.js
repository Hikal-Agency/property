import { Modal, Backdrop, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const SingleDocModal = ({
  singleImageModal,
  handleClose,
  fetchSingleListing,
}) => {
  const { BACKEND_URL, currentMode } = useStateContext();
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const [numPages, setNumPages] = useState();
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleDoc, setSingleDoc] = useState();
  const open = Boolean(anchorEl);

  const pdfUrl = singleDoc?.document_url;
  console.log("Dcoument: ", pdfUrl);

  // fetch single document
  const fetchDocument = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth-token");
      const singleDoc = await axios.get(
        `${BACKEND_URL}/view-document/${singleImageModal?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("SINGLE Dcoument: ", singleDoc);
      setSingleDoc(singleDoc?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error", error);

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

  useEffect(() => {
    fetchDocument();
  }, []);

  console.log("single doc props: ", singleImageModal);

  return (
    <Modal
      keepMounted
      open={singleImageModal?.isOpen}
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
        className={`w-[calc(100%-30px)] md:w-[85%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 rounded-md border boder-[#AAAAAA]`}
      >
        {loading ? (
          <div className="w-full flex items-center justify-center space-x-1">
            <CircularProgress size={20} />
            <span className="font-semibold text-lg">
              {" "}
              Fetching Your Dcoument
            </span>
          </div>
        ) : (
          <>
            <IconButton
              sx={{
                position: "absolute",
                right: 12,
                top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={handleClose}
            >
              <IoMdClose size={18} />
            </IconButton>
            <h1
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } text-center font-semibold text-lg pb-10`}
            >
              Full view of document
            </h1>
            <div className="w-full flex justify-center  h-[700px]">
              <iframe src={pdfUrl} title="Document Viewer"></iframe>
              {/* <Worker
                workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js
"
              >
                <Viewer fileUrl={pdfUrl} />
              </Worker> */}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SingleDocModal;
