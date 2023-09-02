import { CircularProgress, Modal, Backdrop, Button } from "@mui/material";
import { IoIosAlert } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const DeactivateModel = ({
  handleOpenModel,
  deactivateModelClose,
  accountToDelete,
  deletebtnloading,
  deactivateAccount,
  bulkDeleteClicked,
  selectedRows,
  handleBulkDelete,
}) => {
  const { currentMode } = useStateContext();

  console.log("ID: ", accountToDelete);

  return (
    <Modal
      keepMounted
      open={handleOpenModel}
      onClose={deactivateModelClose}
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
          <IoIosAlert size={50} className="text-main-red-color text-2xl" />
          <h1 className="font-semibold pt-3 text-lg">
            {bulkDeleteClicked
              ? "Do You Really Want to deactivate these clients?"
              : "Do You Really Want to deactivate this client?"}
          </h1>
        </div>

        <div className="action buttons mt-5 flex items-center justify-center space-x-2">
          <Button
            className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
            ripple="true"
            size="lg"
            onClick={
              bulkDeleteClicked
                ? handleBulkDelete
                : () => deactivateAccount(accountToDelete)
            }
          >
            {deletebtnloading ? (
              <CircularProgress size={18} sx={{ color: "blue" }} />
            ) : (
              <span>Deactivate</span>
            )}
          </Button>

          <Button
            onClick={deactivateModelClose}
            ripple="true"
            variant="outlined"
            className={`shadow-none  rounded-md text-sm  ${
              currentMode === "dark"
                ? "text-white border-white"
                : "text-main-red-color border-main-red-color"
            }`}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateModel;
