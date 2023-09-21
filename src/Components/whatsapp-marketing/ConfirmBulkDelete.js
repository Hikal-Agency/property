import {useState} from "react";
import { CircularProgress, Modal, Backdrop, Button } from "@mui/material";
import { IoIosAlert } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import {toast} from "react-toastify";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const ConfirmBulkDelete = ({
    bulkDeleteModalOpen,
    handleCloseDeleteModal, 
    FetchLeads,
    selectionModelRef,
    lids,
}) => {
  const { currentMode, fetchSidebarData, BACKEND_URL } = useStateContext();
  const [deletebtnloading, setdeletebtnloading] = useState(false);

  const handleDelete = async (lids) => {
    try {
      setdeletebtnloading(true);
      const token = localStorage.getItem("auth-token");
      const Data = {
        action: "delete",
        ids: lids,
      };
      await axios.post(`${BACKEND_URL}/bulkaction`, JSON.stringify(Data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setdeletebtnloading(false);
      FetchLeads();
      selectionModelRef.current = [];
      handleCloseDeleteModal();
      fetchSidebarData();
      toast.success("Leads Deleted Successfull", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      setdeletebtnloading(false);
      toast.error("Something Went Wrong! Please Try Again", {
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

  return (
    <Modal
      keepMounted
      open={bulkDeleteModalOpen}
      onClose={handleCloseDeleteModal}
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
        className={`w-[calc(100%-20px)] md:w-[40%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
      >
        <div className="flex flex-col justify-center items-center">
          <IoIosAlert size={50} className="text-primary text-2xl" />
          <h1 className="font-semibold pt-3 text-lg">
              Do You Really Want to delete these Leads?
          </h1>
        </div>

        <div className="action buttons mt-5 flex items-center justify-center space-x-2">
          <Button
            className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-primary shadow-none`}
            ripple="true"
            size="lg"
            style={{
              color: "white"
            }}
            onClick={
             () => handleDelete(lids)
            }
          >
            {deletebtnloading ? (
              <CircularProgress size={18} sx={{ color: "blue" }} />
            ) : (
              <span>Delete</span>
            )}
          </Button>

          <Button
            onClick={handleCloseDeleteModal}
            ripple="true"
            variant="outlined"
            className={`shadow-none  rounded-md text-sm  ${
              currentMode === "dark"
                ? "text-white border-white"
                : "text-primary border-primary"
            }`}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmBulkDelete;
