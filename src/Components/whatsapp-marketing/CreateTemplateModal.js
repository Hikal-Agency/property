import { useState } from "react";
import {
  Modal,
  Button,
  Backdrop,
  IconButton,
  TextField,
  TextareaAutosize,
  CircularProgress
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { setId } from "@material-tailwind/react/components/Tabs/TabsContext";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateTemplateModal = ({
  createTemplateModal,
  setCreateTemplateModal,
  fetchTemplates
}) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [btnloading, setbtnloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
    setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      await axios.post(`${BACKEND_URL}/templates`, JSON.stringify({
        name: templateTitle,
        body: templateBody,
        status: "active",
      }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
        toast.success("Template created Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setCreateTemplateModal({isOpen: false});
        fetchTemplates();
        setbtnloading(false);
   } catch (error) {
    console.log(error);
        toast.error("Template creation failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
   } 
  }
  return (
    <>
      <Modal
        keepMounted
        open={createTemplateModal.isOpen}
        onClose={() => setCreateTemplateModal({ isOpen: false })}
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
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
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
            onClick={() => setCreateTemplateModal({ isOpen: false })}
          >
            <IoMdClose size={18} />
          </IconButton>

          <ToastContainer/>

          <form onSubmit={handleSubmit} className="mt-8">
            <TextField
              id="templateTitle"
              type={"text"}
              label="Template Title"
              className="w-full mb-5"
              style={{ marginBottom: "10px" }}
              variant="outlined"
              size="medium"
              required
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
            />

            <TextareaAutosize
              id="template-body"
              placeholder="Template Body"
              type={"text"}
              required
              minRows={8}
              label="Template Body"
              className="w-full"
              style={{
                border: "1px solid",
                padding: 10,
                borderRadius: "4px",
                marginTop: "10px",
                marginBottom: "20px"
              }}
              variant="outlined"
              size="medium"
              value={templateBody}
              onInput={(e) => setTemplateBody(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ padding: "10px 0" }}
            >
              {btnloading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <span>Create Template</span>
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreateTemplateModal;
