import { useState, useEffect } from "react";
import { Box, Button, Avatar } from "@mui/material";
import CreateTemplateModal from "./CreateTemplateModal";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import { BiPen } from "react-icons/bi";
import Markdown from 'markdown-to-jsx';
import {FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";
import UpdateTemplateModal from "./UpdateTemplateModal";

const TemplatesComponent = () => {
  const { BACKEND_URL } = useStateContext();
  const [createTemplateModal, setCreateTemplateModal] = useState({
    isOpen: false,
  });
  const [updateTemplateModal, setUpdateTemplateModal] = useState({
    isOpen: false,
    template: {},
  });
  const [templates, setTemplates] = useState([]);

  const handleUpdateTemplate = (e, template) => {
    if(!e.target.closest(".delete-icon")) {
      setUpdateTemplateModal({
        isOpen: true, 
        template
      });
    }
  }

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/templates`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setTemplates(response.data.templates.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (templateId) => {
    try {
      const token = localStorage.getItem("auth-token");
        await axios.delete(`${BACKEND_URL}/templates/${templateId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
        fetchTemplates();
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
  }

  return (
    <>
      <Box className="min-h-screen">
        <Button
          sx={{ mt: 4 }}
          onClick={() => setCreateTemplateModal({ isOpen: true })}
          variant="contained"
        >
          <BiPen size={18} style={{ marginRight: 5 }} />
          Create New
        </Button>
        <h4 className="font-semibold p-3 mt-5 mb-1">All Templates</h4>
        <Box className="flex flex-wrap">
          {templates.length > 0 ? (
            templates.map((template) => {
              return (
                <Box
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
                </Box>
              );
            })
          ) : (
            <p style={{ color: "red", textAlign: "center" }}>Nothing to show</p>
          )}
        </Box>

        <CreateTemplateModal
          createTemplateModal={createTemplateModal}
          setCreateTemplateModal={setCreateTemplateModal}
          fetchTemplates={fetchTemplates}
        />
        {updateTemplateModal.isOpen &&
        <UpdateTemplateModal
          updateTemplateModal={updateTemplateModal}
          setUpdateTemplateModal={setUpdateTemplateModal}
          fetchTemplates={fetchTemplates}
        />
        }
      </Box>
    </>
  );
};

export default TemplatesComponent;