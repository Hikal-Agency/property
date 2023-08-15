import { useState } from "react";
import {
  Modal,
  Button,
  Backdrop,
  IconButton,
  TextField,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";

import axios from "../../axoisConfig";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import RichEditor from "./richEditorComp/RichEditor";
import { ImAttachment } from "react-icons/im";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateTemplateModal = ({
  createTemplateModal,
  setCreateTemplateModal,
  fetchTemplates,
}) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [templateType, setTemplateType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      await axios.post(
        `${BACKEND_URL}/templates`,
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
      setCreateTemplateModal({ isOpen: false });
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
  };
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
          className={`w-[calc(100%-20px)] md:w-[70%] h-[90%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md overflow-y-scroll`}
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
          <strong className="text-lg">Compose Template</strong>
          <form onSubmit={handleSubmit} className="mt-8">
            <TextField
              id="template-type"
              select
              sx={{
                "&": {
                  marginBottom: "1.25rem !important",
                },
              }}
              value={templateType}
              label="Template Type"
              required
              onChange={(e) => setTemplateType(e.target.value)}
              size="medium"
              className="w-full mb-5"
              displayEmpty
            >
              <MenuItem value="">
                Select Template Type
                <span className="ml-1" style={{ color: "red" }}>
                  *
                </span>
              </MenuItem>

              <MenuItem value="whatsapp">Whatsapp Message</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="mail">Email</MenuItem>
            </TextField>
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
            <div
              style={{
                height: "320px",
                marginBottom: "20px",
                overflowY: "scroll",
              }}
            >
              <RichEditor setMessageValue={setTemplateBody}/>
            </div>
            <div className="flex justify-between items-center border-t-[#ededed] pt-2">
              <div className="flex items-center text-center">
                <Button>
                  <ImAttachment />
                  <span class="ml-1">Attach File</span>
                </Button>
                <span className="ml-3 mr-5">OR</span>
                <div className="flex items-center">
                  <TextField
                    id="imageURL"
                    type={"text"}
                    label="Image URL"
                    variant="outlined"
                    size="small"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="contained"
                style={{ padding: "10px 12px", backgroundColor: "#da1f26" }}
              >
                {btnloading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  <span>Create Template</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreateTemplateModal;
