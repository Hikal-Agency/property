import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-preset-webpage";

const GrapesJSEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      // Add your GrapesJS options here
      fromElement: true, // Initializes the editor from the content inside the container
      height: "autopx",
      width: "auto",
      storageManager: false, // Disable storage manager for demo purposes
      plugins: ["gjs-preset-webpage"],
      pluginsOpts: {
        "gjs-preset-webpage": {
          /* options for the plugin */
        },
      },
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
