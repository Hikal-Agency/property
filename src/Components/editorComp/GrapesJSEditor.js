import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import { useStateContext } from "../../context/ContextProvider";
// import "grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css";
// import "grapesjs/dist/css/grapes.min.css";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { Box, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
const GrapesJSEditor = () => {
  const editorRef = useRef(null);
  const { t, BACKEND_URL, darkModeColors } = useStateContext();
  const [templateName, setTemplateName] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const { id } = useNavigate();
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      // Add your GrapesJS options here
      // fromElement: true, // Initializes the editor from the content inside the container
      // height: "100vh",
      // width: "auto",
      // storageManager: false, // Disable storage manager for demo purposes
      // plugins: ["gjs-preset-webpage"],
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        gjsPresetWebpage: {},
      },
    });

    addCustomBlocks(editor);

    // button components
    editor.BlockManager.add("button-block", {
      label: "Button",
      content: {
        tagName: "button",
        type: "button", // Specify the type to differentiate from default types
        // content: '<i class="fa fa-envelope"></i> Click me',
        content: '<i class="fa fa-envelope"></i> Click me',
        style: {
          padding: "10px 20px",
          fontSize: "16px",
          margin: "10px",
          display: "inline-block", // Ensure it's not full width
          cursor: "pointer",
        },
        attributes: { class: "btn btn-primary" }, // Use classes to style the button or handle it with CSS
      },
      category: "Basic", // Specify the category under which the block should be listed
    });

    // reference to editor instance for use in any function
    editorRef.current = editor;

    const loadTemplate = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/page-templates/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const { html, css } = response.data;

        const editor = editorRef.current;
        editor.setComponents(html);
        editor.setStyle(css);
      } catch (error) {
        console.error("Error fetching template data:", error);
        toast.error("Error fetching template.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/templates");
      }
    };

    if (id) {
      loadTemplate();
    }

    // Cleanup function to destroy the editor when the component unmounts
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  const addCustomBlocks = (editor) => {
    // Text Block
    editor.BlockManager.add("text-block", {
      label: "Text",
      content: '<div data-gjs-type="text">Insert your text here</div>',
      category: "Basic",
    });

    // Image Block
    editor.BlockManager.add("image-block", {
      label: "Image",
      content: { type: "image" },
      category: "Basic",
    });

    // Video Block
    editor.BlockManager.add("video-block", {
      label: "Video",
      content: {
        type: "video",
        src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        style: {
          height: "auto",
          width: "100%",
        },
      },
      category: "Media",
    });

    // Map Block (Using iframe for simplicity)
    editor.BlockManager.add("map-block", {
      label: "Map",
      content: {
        type: "map",
        content:
          '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3160922827!2d-74.25987568785094!3d40.697670063392394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1579770195147!5m2!1sen!2sbd" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen=""></iframe>',
        style: {
          height: "400px",
          width: "100%",
        },
      },
      category: "Media",
    });

    // 1 Column Block
    editor.BlockManager.add("1-col-block", {
      label: "1 Column",
      content:
        '<div class="row"><div class="col" style="min-height: 75px; border: 1px solid #ddd;">Column 1</div></div>',
      category: "Columns",
    });

    // 2 Columns Block
    editor.BlockManager.add("2-col-block", {
      label: "2 Columns",
      content: `
    <div style="display: flex;">
      <div style="flex: 1; min-height: 75px; border: 1px solid #ddd; margin-right: 10px;" data-gjs-droppable="true"></div>
      <div style="flex: 1; min-height: 75px; border: 1px solid #ddd;" data-gjs-droppable="true"></div>
    </div>`,
      category: "Columns",
    });

    // 3 Columns Block
    editor.BlockManager.add("3-col-block", {
      label: "3 Columns",
      content: `
        <div style="display: flex;">
          <div style="flex: 1; min-height: 75px; border: 1px solid #ddd; margin-right: 10px;" data-gjs-droppable="true"></div>
          <div style="flex: 1; min-height: 75px; border: 1px solid #ddd; margin-right: 10px;" data-gjs-droppable="true">Column 2</div>
          <div style="flex: 1; min-height: 75px; border: 1px solid #ddd;" data-gjs-droppable="true">Column 3</div>
        </div>`,
      category: "Columns",
    });

    // form
    editor.BlockManager.add("form-block", {
      label: "Form",
      content: {
        tagName: "form",
        draggable: true, // Allow the form to be draggable in the editor
        attributes: { method: "POST", action: "#" }, // Example attributes
        style: {
          display: "flex", // Use flexbox
          "flex-direction": "column", // Stack children vertically
          gap: "10px", // Add some space between elements
          padding: "20px", // Padding around the form
        },
        components: [
          // Initial components inside the form
          {
            tagName: "label",
            content: "Name:",
            attributes: { for: "name" },
          },
          {
            tagName: "input",
            type: "text",
            attributes: { name: "name", placeholder: "Enter your name" },
            style: {
              padding: "5px",
              margin: "5px 0",
              width: "calc(100% - 10px)",
            }, // Ensure inputs take full width
          },
          {
            tagName: "label",
            content: "Email:",
            attributes: { for: "email" },
          },
          {
            tagName: "input",
            type: "email",
            attributes: { name: "email", placeholder: "Enter your email" },
            style: {
              padding: "5px",
              margin: "5px 0",
              width: "calc(100% - 10px)",
            }, // Ensure inputs take full width
          },
          {
            tagName: "button",
            content: "Submit",
            attributes: { type: "submit" },
            style: { padding: "10px", cursor: "pointer" },
          },
        ],
      },
      category: "Forms", // Categorize under 'Forms' in the block manager
    });

    // Input Field
    editor.BlockManager.add("input-block", {
      label: "Input",
      content: {
        tagName: "input",
        type: "text",
        attributes: { type: "text", placeholder: "Enter text here" },
        style: { padding: "10px", margin: "5px 0", width: "calc(100% - 20px)" },
      },
      category: "Forms",
    });

    // Textarea
    editor.BlockManager.add("textarea-block", {
      label: "Textarea",
      content: {
        tagName: "textarea",
        content: "",
        attributes: { placeholder: "Enter your message" },
        style: {
          padding: "10px",
          margin: "5px 0",
          width: "calc(100% - 20px)",
          height: "100px",
        },
      },
      category: "Forms",
    });

    // Checkbox
    editor.BlockManager.add("checkbox-block", {
      label: "Checkbox",
      content: {
        tagName: "label",
        content: `<input type="checkbox" name="checkbox" value="1"> Checkbox`,
        style: { margin: "5px 0", display: "inline-block" },
      },
      category: "Forms",
    });

    // Radio Button
    editor.BlockManager.add("radio-block", {
      label: "Radio Button",
      content: {
        tagName: "label",
        content: `<input type="radio" name="radio" value="1"> Radio`,
        style: { margin: "5px 0", display: "inline-block" },
      },
      category: "Forms",
    });
  };

  const saveLandingPage = async () => {
    if (!editorRef.current) {
      console.error("The GrapesJS editor instance is not initialized");
      toast.error("The GrapesJS editor instance is not initialized.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!templateName) {
      toast.error("Template name is required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    setBtnLoading(true);

    const html = editorRef.current.getHtml(); // Get HTML code
    const css = editorRef.current.getCss(); // Get CSS code

    // Log HTML and CSS for debugging purposes
    console.log("HTML:", html);
    console.log("CSS:", css);

    const data = {
      template_name: templateName,
      template_type: "Basic",
      html: html,
      css: css,
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/page-templates/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("successfully posted", response.data);

      toast.success("Page successfully saved.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setBtnLoading(false);
      navigate("/templates");
    } catch (error) {
      setBtnLoading(false);
      console.error("Export failed", error);
      toast.error("Unable to save page.", {
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
      <div className="flex justify-end space-x-3">
        <Box sx={darkModeColors}>
          <TextField
            id="username"
            type={"text"}
            label={t("landing_page_name")}
            // className="w-full"
            style={{
              marginBottom: "20px",
            }}
            variant="outlined"
            size="small"
            required
            value={templateName}
            onChange={(e) => {
              setTemplateName(e.target.value);
            }}
          />
        </Box>
        <button
          className="rounded-md bg-primary p-2 text-white mb-5 "
          onClick={saveLandingPage}
        >
          {btnLoading ? (
            <CircularProgress />
          ) : (
            <span>{t("funnel_form_save")}</span>
          )}
        </button>
      </div>
      <div id="gjs" ref={editorRef}></div>
    </>
  );
};

export default GrapesJSEditor;
