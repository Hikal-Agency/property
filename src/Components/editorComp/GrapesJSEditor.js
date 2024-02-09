import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";
// import "grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css";
// import "grapesjs/dist/css/grapes.min.css";
const GrapesJSEditor = () => {
  const editorRef = useRef(null);

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

    // button components
    editor.BlockManager.add("button-block", {
      label: "Button",
      content: {
        tagName: "button",
        type: "button", // Specify the type to differentiate from default types
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

    // Cleanup function to destroy the editor when the component unmounts
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  return <div id="gjs" ref={editorRef}></div>;
};

export default GrapesJSEditor;
