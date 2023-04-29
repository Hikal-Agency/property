import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import CreateTemplateModal from "./CreateTemplateModal";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import { BiPen } from "react-icons/bi";
import Markdown from 'markdown-to-jsx';

const TemplatesComponent = () => {
  const { BACKEND_URL } = useStateContext();
  const [createTemplateModal, setCreateTemplateModal] = useState({
    isOpen: false,
  });
  const [templates, setTemplates] = useState([]);

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
                  key={template.name}
                  className="w-[45%] max-h-[200px] overflow-y-scroll bg-slate-600 m-3 text-white cursor-pointer p-4 rounded"
                >
                  <h3 style={{ fontSize: 18 }}>
                    <strong>{template.name}</strong>
                  </h3>
                  <hr />
                  <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
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
      </Box>
    </>
  );
};

export default TemplatesComponent;