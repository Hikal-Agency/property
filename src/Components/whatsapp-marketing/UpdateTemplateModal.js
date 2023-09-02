import { useState } from "react";
import {
  Modal,
  Button,
  Backdrop,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";

import axios from "../../axoisConfig";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import RichEditor from "./richEditorComp/RichEditor";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const UpdateTemplateModal = ({
  updateTemplateModal,
  setUpdateTemplateModal,
  fetchTemplates,
}) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [templateTitle, setTemplateTitle] = useState(
    updateTemplateModal?.template?.name
  );
  const [templateBody, setTemplateBody] = useState(
    updateTemplateModal?.template?.body
  );
  const [btnloading, setbtnloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      await axios.post(
        `${BACKEND_URL}/templates/${updateTemplateModal?.template?.id}`,
        JSON.stringify({
          name: templateTitle,
          body: templateBody,
          status: "active",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Template updated Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setUpdateTemplateModal({ isOpen: false });
      fetchTemplates();
      setbtnloading(false);
    } catch (error) {
      console.log(error);
      toast.error("Template update failed", {
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
  };
  return (
    <>
      
      <Modal
        keepMounted
        open={updateTemplateModal.isOpen}
        onClose={() => setUpdateTemplateModal({ isOpen: false })}
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
          className={`w-[calc(100%-20px)] md:w-[70%] h-[90%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md overflow-y-scroll`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setUpdateTemplateModal({ isOpen: false })}
          >
            <IoMdClose size={18} />
          </IconButton>
          <strong className="text-lg">Update Template</strong>
          <form onSubmit={handleSubmit} className="mt-8">
            <TextField
              id="templateTitle"
              type={"text"}
              label="Template Name"
              className="w-full mb-5"
              style={{ marginBottom: "10px" }}
              variant="outlined"
              size="medium"
              required
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
            />
            {/* <TextareaAutosize
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
              /> */}
            <div style={{ 
                height: "320px",
                marginBottom: "20px",
                overflowY: "scroll",
            }}>
              <RichEditor
                messageValue={updateTemplateModal?.template?.body}
                setMessageValue={setTemplateBody}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ padding: "10px 0", backgroundColor: "#da1f26"  }}
            >
              {btnloading ? (
                <CircularProgress size={18} sx={{ color: "white"}} />
              ) : (
                <span>Update Template</span>
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default UpdateTemplateModal;
