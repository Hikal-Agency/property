import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import CreateTemplateModal from "./CreateTemplateModal";
import { useStateContext } from "../../context/ContextProvider";
// import axios from "axios";
import axios from "../../axoisConfig";
import { BiPen } from "react-icons/bi";
import Markdown from "markdown-to-jsx";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import UpdateTemplateModal from "./UpdateTemplateModal";
import Loader from "../Loader";

const TemplatesComponent = () => {
  const { BACKEND_URL, currentMode } = useStateContext();
  const [createTemplateModal, setCreateTemplateModal] = useState({
    isOpen: false,
  });
  const [loading, setLoading] = useState(false);
  const [updateTemplateModal, setUpdateTemplateModal] = useState({
    isOpen: false,
    template: {},
  });
  const [templates, setTemplates] = useState([]);

  const handleUpdateTemplate = (e, template) => {
    if (!e.target.closest(".delete-btn")) {
      setUpdateTemplateModal({
        isOpen: true,
        template,
      });
    }
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
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box className="min-h-screen">
          <Box className="flex items-center justify-between mt-3">
                  <h1
                    className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                    Templates
                  </h1>
            <Button
              sx={{padding: "10px", ml: 1 }}
              onClick={() => setCreateTemplateModal({ isOpen: true })}
              variant="contained"
            >
              <BiPen size={18} style={{ marginRight: 5 }} />
              Create New
            </Button>
          </Box>
          <Box className="flex flex-wrap mt-3">
            {templates.length > 0 ? (
              templates.map((template) => {
                return (
                  <>
                    {/* <Box
                onClick={(e) => handleUpdateTemplate(e, template)}
                  key={template.name}
                  className="w-[45%] max-h-[200px] overflow-y-scroll bg-slate-600 m-3 text-white cursor-pointer p-4 rounded"
                >
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontSize: 18 }}>
                    <strong>{template.name}</strong>
                  </h3>
              <div onClick={() => handleDelete(template.id)} className="delete-icon rounded-full">
                <Avatar
                style={{width: 35, height: 35, background: "red"}}
                  className="shadow-md"
                >
                  <FaTrash size={16}/>
                </Avatar>
              </div>
                </div>
                  <p className="border rounded border-gray-100 p-3" style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
                    <Markdown>{template.body}</Markdown>
                  </p>
                </Box> */}
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
              })
            ) : (
              <p style={{ color: "red", textAlign: "center" }}>
                Nothing to show
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
        </Box>
      )}
    </>
  );
};

export default TemplatesComponent;
