import { useState, useEffect } from "react";
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
import { MdClose } from "react-icons/md";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};
const CreateTemplateModal = ({
  createTemplateModal,
  setCreateTemplateModal,
  fetchTemplates,
}) => {
  const { currentMode, BACKEND_URL, t, isLangRTL, i18n } = useStateContext();
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [templateType, setTemplateType] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setCreateTemplateModal({ isOpen: false });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      const data = {
        name: templateTitle,
        body: templateBody,
        type: templateType,
        status: "active",
      };

      if (imageURL) {
        data["image_url"] = imageURL;
      }
      await axios.post(`${BACKEND_URL}/templates`, JSON.stringify(data), {
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

  useEffect(() => {
    setTemplateTitle("");
    setTemplateBody("");
    setImageURL("");
  }, [templateType]);
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
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
        w-[100vw] h-[100vh] flex items-start justify-end`}
        >
          <button
            // onClick={handleLeadModelClose}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className="hover:border hover:border-white hover:rounded-full"
            />
          </button>
          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${isLangRTL(i18n.language) ? "border-r-2" : "border-l-2"}
             p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
            `}
          >
            {/* <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setCreateTemplateModal({ isOpen: false })}
          >
            <IoMdClose size={18} />
          </IconButton> */}
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
                label={t("template_type")}
                required
                onChange={(e) => setTemplateType(e.target.value)}
                size="medium"
                className="w-full mb-5"
                displayEmpty
              >
                <MenuItem disabled selected value="">
                  {`${t("label_select")} ${t("template_type")}`}
                  <span className="ml-1 text-primary">*</span>
                </MenuItem>

                <MenuItem value="whatsapp">{t("whatsapp_message")}</MenuItem>
                <MenuItem value="sms">{t("sms")}</MenuItem>
                <MenuItem value="email">{t("label_email")}</MenuItem>
              </TextField>
              {templateType && (
                <TextField
                  type={"text"}
                  label={t("template_name")}
                  className="w-full mb-5"
                  style={{ marginBottom: "10px" }}
                  variant="outlined"
                  size="medium"
                  required
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                />
              )}

              {templateType === "whatsapp" ? (
                <div
                  style={{
                    height: "280px",
                    marginBottom: "20px",
                    overflowY: "scroll",
                  }}
                >
                  <RichEditor setMessageValue={setTemplateBody} />
                </div>
              ) : templateType === "sms" ? (
                <div
                  style={{
                    height: "280px",
                    marginBottom: "20px",
                    overflowY: "scroll",
                  }}
                >
                  <div className="w-full h-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                      <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x ">
                        <div className="flex flex-wrap items-center">
                          {templateBody?.trim()?.length} {t("characters")}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 19 19"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                          />
                        </svg>
                        <span className="sr-only">{t("full_screen")}</span>
                      </button>
                    </div>
                    <div className="px-4 h-full py-2 bg-white rounded-b-lg">
                      <textarea
                        value={templateBody}
                        onInput={(e) => setTemplateBody(e.target.value)}
                        className="block focus:border-0 focus:outline-none w-full h-full px-0 text-gray-800 bg-white border-0 focus:ring-0 "
                        placeholder={t("type_the_message")}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : templateType === "email" ? (
                <h1>{t("label_email")}</h1>
              ) : (
                <></>
              )}
              <div className="flex justify-between items-center border-t-[#ededed] pt-2">
                {templateType === "whatsapp" && (
                  <div className="flex items-center text-center">
                    <Button>
                      <ImAttachment />
                      <span class="ml-1">{t("attach_file")}</span>
                    </Button>
                    <span className="ml-3 mr-5">{t("or")}</span>
                    <div className="flex items-center">
                      <TextField
                        id="imageURL"
                        type={"text"}
                        label={t("image_url")}
                        variant="outlined"
                        sx={{ width: "400px" }}
                        size="small"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {templateType && (
                  <Button
                    type="submit"
                    variant="contained"
                    className="bg-btn-primary"
                    style={{ padding: "10px 12px", color: "white" }}
                  >
                    {btnloading ? (
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    ) : (
                      <span>{t("create_template")}</span>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateTemplateModal;
