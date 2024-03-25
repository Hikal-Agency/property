import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import { useStateContext } from "../../context/ContextProvider";
// import "grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css";
// import "grapesjs/dist/css/grapes.min.css";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { compressData, decompressData } from "../../utils/compressionFunction";
import pako from "pako";
const GrapesJSEditor = () => {
  const editorRef = useRef(null);
  const { t, BACKEND_URL, darkModeColors, currentMode } = useStateContext();
  const [templateName, setTemplateName] = useState("");
  const [scriptModal, setScriptModal] = useState({
    open: false,
    data: null,
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  console.log("template id:: ", id);
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const copyScript = (e) => {
    e.preventDefault();

    const getScript = document.getElementById("template-script");

    console.log("getscript :: ", getScript.textContent);

    navigator.clipboard.writeText(getScript.textContent).then(
      () => {
        toast.success("Script copied.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log("Script copied to clipboard!");
        setScriptModal({ open: false });
        navigate("/templates");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Unable to copy the script.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    );
  };

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

    const loadTemplate = async () => {
      setLoading(true);
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
        console.log("single page template:: ", response);
        const { html, css, template_name } =
          response?.data?.data?.page_template;
        const deCompressHTML = decompressData(html);
        const deCompressCSS = decompressData(css);
        setTemplateName(template_name);

        console.log("decompress html: ", deCompressHTML);
        console.log("decompress css: ", deCompressCSS);
        console.log("editor loaded: ", editor);

        // const editor = editorRef.current;
        editor.setComponents(deCompressHTML);
        editor.setStyle(deCompressCSS);

        setLoading(false);
      } catch (error) {
        setLoading(false);
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

    editor.on("component:add", (model) => {
      console.log("attributes type:: ", model.attributes);
      if (model.attributes.tagName === "form") {
        console.log("form");

        const actualForm = model.getEl(); // Get actual DOM element from the component
        actualForm.addEventListener("submit", handleForm);
        // }
      }
    });

    // editor.on("component:update", (component) => {
    //   console.log("component::::::::::::::::: ", component);
    //   // if (component.is("form")) {
    //   if (component.attributes.tagName === "form") {
    //     console.log("form");
    //     // This checks if the component is a form
    //     const formElement = component.getEl();
    //     formElement.addEventListener("submit", handleForm);
    //   }
    // });

    // Cleanup function to destroy the editor when the component unmounts
    return () => {
      if (editor) {
        editor.getComponents().forEach((component) => {
          if (component.attributes.tagName === "form") {
            const formElement = component.getEl();
            formElement.removeEventListener("submit", handleForm);
          }
        });
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
        editable: true,
        attributes: {
          method: "POST",
          action: "https://testing.hikalcrm.com/api/create-lead",
          class: "custom-form",
        }, // Example attributes
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
            traits: [
              {
                type: "text",
                label: "Text",
                name: "content",
                changeProp: 1,
              },
            ],
          },
          {
            tagName: "input",
            type: "text",
            attributes: { name: "leadName", placeholder: "Enter your name" },
            style: {
              padding: "5px",
              margin: "5px 0",
              width: "calc(100% - 10px)",
            }, // Ensure inputs take full width
          },
          {
            tagName: "label",
            content: "Phone:",
            attributes: { for: "text" },
          },
          {
            tagName: "input",
            type: "text",
            attributes: {
              name: "leadContact",
              placeholder: "Enter your phone",
            },
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
            attributes: {
              name: "leadEmail",
              placeholder: "Enter your email",
            },
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
    // editor.BlockManager.add("input-block", {
    //   label: "Input",
    //   content: {
    //     tagName: "input",
    //     type: "text",
    //     attributes: { type: "text", placeholder: "Enter text here" },
    //     style: { padding: "10px", margin: "5px 0", width: "calc(100% - 20px)" },
    //   },
    //   category: "Forms",
    // });

    // Textarea
    // editor.BlockManager.add("textarea-block", {
    //   label: "Textarea",
    //   content: {
    //     tagName: "textarea",
    //     content: "",
    //     attributes: { placeholder: "Enter your message" },
    //     style: {
    //       padding: "10px",
    //       margin: "5px 0",
    //       width: "calc(100% - 20px)",
    //       height: "100px",
    //     },
    //   },
    //   category: "Forms",
    // });

    // Checkbox
    // editor.BlockManager.add("checkbox-block", {
    //   label: "Checkbox",
    //   content: {
    //     tagName: "label",
    //     content: `<input type="checkbox" name="checkbox" value="1"> Checkbox`,
    //     style: { margin: "5px 0", display: "inline-block" },
    //   },
    //   category: "Forms",
    // });

    // Radio Button
    // editor.BlockManager.add("radio-block", {
    //   label: "Radio Button",
    //   content: {
    //     tagName: "label",
    //     content: `<input type="radio" name="radio" value="1"> Radio`,
    //     style: { margin: "5px 0", display: "inline-block" },
    //   },
    //   category: "Forms",
    // });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    console.log("handle form");

    var form = e.target;
    console.log("form ", form);

    const formData = new FormData(e.target);
    console.log("formdata:: ", formData);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const saveData = await axios.post(
        `https://testing.hikalcrm.com/api/create-lead`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("save form data:: ", saveData);
      toast.success("Form submitted successfully..", {
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
      console.log("error:: ", error);
      toast.error("Unable to save the data.", {
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

    const compressHTML = compressData(html);
    const compressCSS = compressData(css);

    if (compressHTML?.success === false || compressCSS?.success === false) {
      console.error("error", compressCSS?.error, compressHTML?.error);
      toast.error("Unable to compress the data.", {
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

      return;
    }

    console.log("compress html: ", compressHTML);
    console.log("compress css: ", compressCSS);

    const data = {
      template_name: templateName,
      template_type: "Basic",
      html: compressHTML,
      css: compressCSS,
    };

    let url;

    if (id) {
      url = `${BACKEND_URL}/page-templates/${id}`;
    } else {
      url = `${BACKEND_URL}/page-templates/`;
    }

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("successfully posted", response.data);

      toast.success(`Page successfully ${id ? "updated" : "saved"}.`, {
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
      setScriptModal({
        open: true,
        data: response?.data?.data,
      });
      // navigate("/templates");
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
      {/* {loading ? (
        <div className="w-full flex items-center justify-center h-[500px]">
          <CircularProgress />
        </div>
      ) : (
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
      )} */}
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

      {scriptModal?.open && (
        <Modal
          keepMounted
          open={scriptModal?.open}
          onClose={() => setScriptModal({ open: false })}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
          closeAfterTransition
          // BackdropComponent={Backdrop}
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
              <h1
                className={`font-semibold pt-3 text-lg ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                {t("copy_script")}
              </h1>
            </div>

            <pre
              className={`
               bg-[#f5f5f5] h-[300px] p-4 rounded-md overflow-auto mt-4 `}
            >
              <code id="template-script">
                {`<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako_inflate.min.js"></script>
    <script>
      (function () {
        var uniqueId = ${scriptModal?.data?.id};
        var endpoint =
          "https://testing.hikalcrm.com/api/page-templates/" + uniqueId;

        fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + "34|5npCV56W9y5YpMvePVpkTsQc1l9qAIUOSMVH2bsu934ef9b4",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Data:: ", data);
            const resData = data?.data?.page_template
            //  'data' contains the base64 encoded and compressed HTML and CSS

            var decompressedHtml = decompressData(resData?.html);
            var decompressedCss = decompressData(resData?.css);

            var container = document.createElement("div");
            container.innerHTML = decompressedHtml;
            document.body.appendChild(container);

            var styleTag = document.createElement("style");
            styleTag.innerHTML = decompressedCss;
            document.head.appendChild(styleTag);
          })
          .catch((error) =>
            console.error("Error loading landing page:", error)
          );

        function decompressData(base64Data) {
          console.log("data to decompressed:: ", base64Data);
          try {
            var compressedDataArray = atob(base64Data).split(",");
            //   .map((char) => char.charCodeAt(0));
            var decompressedData = JSON.parse(
              pako.inflate(new Uint8Array(compressedDataArray), {
                raw: true,
                to: "string",
              })
            );
            return decompressedData;
          } catch (e) {
            console.error("Decompression error:", e);
            return "";
          }
        }
      })();
    </script>`}
              </code>
            </pre>

            <div className="action buttons mt-5 flex items-center justify-center space-x-2">
              <Button
                className={`bg-btn-primary `}
                ripple="true"
                size="lg"
                onClick={(e) => copyScript(e)}
              >
                {btnLoading ? (
                  <CircularProgress size={18} sx={{ color: "blue" }} />
                ) : (
                  <span className="text-white text-lg">{t("copy")}</span>
                )}
              </Button>

              <Button
                onClick={() => setScriptModal({ open: false })}
                ripple="true"
                variant="outlined"
                className={`shadow-none  rounded-md text-sm  ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-main-red-color border-main-red-color"
                }`}
              >
                {t("close")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default GrapesJSEditor;
