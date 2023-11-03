import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@mui/material";
import CreateTemplateModal from "./CreateTemplateModal";
import { useStateContext } from "../../context/ContextProvider";

import axios from "../../axoisConfig";
import DeleteTemplateModal from "./DeleteTemplateModal";
import { BiPlus } from "react-icons/bi";
import { MdEmail, MdSms } from "react-icons/md";
import { HiTemplate } from "react-icons/hi";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash, BsWhatsapp } from "react-icons/bs";
import { toast } from "react-toastify";
import UpdateTemplateModal from "./UpdateTemplateModal";
import Loader from "../Loader";
import TemplatesCountCard from "./TemplatesCountCard";

const TemplatesComponent = () => {
  const {
    BACKEND_URL,
    currentMode,
    t,
    themeBgImg,
    blurDarkColor,
    blurLightColor,
    isLangRTL,
    i18n,
  } = useStateContext();
  const [createTemplateModal, setCreateTemplateModal] = useState({
    isOpen: false,
  });
  const [isClosing, setIsClosing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [updateTemplateModal, setUpdateTemplateModal] = useState({
    isOpen: false,
    template: {},
  });
  const [deleteTemplateModal, setDeleteTemplateModal] = useState({
    isOpen: false,
    templateId: null,
  });
  const [templates, setTemplates] = useState([]);
  const [deletebtnloading, setdeletebtnloading] = useState(false);

  const handleUpdateTemplate = (e, template) => {
    setUpdateTemplateModal({
      isOpen: true,
      template,
    });
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/templates`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setTemplates(response.data.templates.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (templateId) => {
    try {
      setdeletebtnloading(true);
      setLoading(true);
      const token = localStorage.getItem("auth-token");
      await axios.delete(`${BACKEND_URL}/templates/${templateId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      fetchTemplates();
      setLoading(false);
      toast.success("Template Deleted Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      toast.error("Couldn't delete template", {
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
    setDeleteTemplateModal({ isOpen: false, templateId: null });
    setdeletebtnloading(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box className="min-h-screen">
          <Box className="flex items-center justify-between">
            <div className="w-full flex items-center justify-between pb-3">
              <div className="flex items-center">
                <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("title_message_templates")}
                </h1>
              </div>
              <Button
                className="bg-btn-primary"
                style={{
                  color: "white",
                }}
                sx={{
                  ml: 1,
                  mr: 2,
                  padding: "5px 10px",
                  fontSize: 11,
                }}
                onClick={() => setCreateTemplateModal({ isOpen: true })}
                variant="contained"
              >
                <BiPlus size={16} style={{ marginRight: 5 }} />
                {t("button_add_template")}
              </Button>
            </div>
          </Box>
          <Box
            className="flex flex-wrap items-center justify-between my-3 gap-y-3 gap-x-1"
            sx={{ color: currentMode === "dark" ? "white" : "black" }}
          >
            <TemplatesCountCard
              icon={<HiTemplate size={18} />}
              type={t("all_templates")}
              count={templates?.length}
            />
            <TemplatesCountCard
              icon={<MdEmail size={18} />}
              type={t("email_templates")}
              count={templates?.map((temp) => temp?.type === "email")?.length}
            />
            <TemplatesCountCard
              icon={<BsWhatsapp size={18} />}
              type={t("whatsapp_templates")}
              count={
                templates?.map((temp) => temp?.type === "whatsapp")?.length
              }
            />
            <TemplatesCountCard
              icon={<MdSms size={18} />}
              type={t("sms_templates")}
              count={templates?.map((temp) => temp?.type === "sms")?.length}
            />
          </Box>
          <Box className="flex flex-wrap mt-3">
            {templates.length > 0 ? (
              <>
                {/* templates.map((template) => {
                return (
                  <>
                    <Card
                      key={template.name}
                      className={`w-[45%] max-h-[200px] border ${
                        currentMode === "dark"
                          ? "border-white"
                          : "border-red-600"
                      } mx-2 my-1 overflow-y-scroll cursor-pointer`}
                      onClick={(e) => handleUpdateTemplate(e, template)}
                      sx={{
                        bgcolor: currentMode === "dark" ? "#111827" : "#eee",
                        color: currentMode === "dark" ? "white" : "black",
                        marginBottom: 2,
                      }}
                    >
                      <CardHeader
                        titleTypographyProps={{ sx: { fontWeight: "bold" } }}
                        title={template.name}
                        action={
                          <div
                            className="delete-btn"
                            onClick={() => handleDelete(template.id)}
                          >
                            <IconButton>
                              <FaTrash
                                size={16}
                                color={currentMode === "dark" ? "white" : "red"}
                              />
                            </IconButton>
                          </div>
                        }
                      />
                      <CardContent>
                        <Typography variant="body1">
                          <Markdown>{template.body}</Markdown>
                        </Typography>
                      </CardContent>
                    </Card>
                  </>
                );
              }) */}
                <TableContainer component={Paper} className="bg-transparent">
                  <Table aria-label="simple table" sx={{ maxWidth: "100%" }}>
                    <TableHead className="bg-primary">
                      <TableRow className="uppercase font-semibold text-white">
                        <TableCell>
                          <Box className="flex items-center text-white">
                            {t("name")}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center text-white">
                            {t("type")}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center text-white">
                            {t("label_action")}
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="bg-transparent">
                      {templates.map((template) => (
                        <TableRow
                          key={template?.id}
                          sx={{
                            background: !themeBgImg
                              ? currentMode === "dark"
                                ? "black"
                                : "white"
                              : currentMode === "dark"
                              ? blurDarkColor
                              : blurLightColor,
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            sx={{
                              color: currentMode === "dark" ? "white" : "black",
                            }}
                            component="th"
                            scope="row"
                          >
                            {template?.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: currentMode === "dark" ? "white" : "black",
                            }}
                          >
                            plain-text
                          </TableCell>
                          <TableCell
                            sx={{
                              color: currentMode === "dark" ? "white" : "black",
                            }}
                          >
                            <Box className="w-full flex items-center">
                              <p
                                style={{ cursor: "pointer" }}
                                className={`${
                                  currentMode === "dark"
                                    ? "text-[#FFFFFF] bg-[#262626]"
                                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                                } hover:bg-blue-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                              >
                                <Tooltip title="Edit Template" arrow>
                                  <button
                                    onClick={(e) =>
                                      handleUpdateTemplate(e, template)
                                    }
                                  >
                                    <AiOutlineEdit size={16} />
                                  </button>
                                </Tooltip>
                              </p>
                              <p
                                style={{ cursor: "pointer" }}
                                className={`${
                                  currentMode === "dark"
                                    ? "text-[#FFFFFF] bg-[#262626]"
                                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                                } hover:bg-red-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                              >
                                <Tooltip title="Delete Template" arrow>
                                  <button
                                    onClick={() =>
                                      setDeleteTemplateModal({
                                        isOpen: true,
                                        templateId: template?.id,
                                      })
                                    }
                                  >
                                    <BsTrash size={16} />
                                  </button>
                                </Tooltip>
                              </p>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <p style={{ color: "red", textAlign: "center" }}>
                {t("nothing_to_show")}
              </p>
            )}
          </Box>

          <CreateTemplateModal
            createTemplateModal={createTemplateModal}
            setCreateTemplateModal={setCreateTemplateModal}
            fetchTemplates={fetchTemplates}
          />
          {updateTemplateModal.isOpen && (
            <UpdateTemplateModal
              updateTemplateModal={updateTemplateModal}
              setUpdateTemplateModal={setUpdateTemplateModal}
              fetchTemplates={fetchTemplates}
            />
          )}
          {deleteTemplateModal?.isOpen && (
            <DeleteTemplateModal
              deleteTemplate={handleDelete}
              deleteTemplateModal={deleteTemplateModal}
              deletebtnloading={deletebtnloading}
              handleCloseDeleteTemplateModal={() =>
                setDeleteTemplateModal({ isOpen: false, templateId: null })
              }
            />
          )}
        </Box>
      )}
    </>
  );
};

export default TemplatesComponent;
