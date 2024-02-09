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
      <div class="row" style="display: flex;">
        <div class="col" style="flex: 1; min-height: 75px; border: 1px solid #ddd; margin-right: 10px;">Column 1</div>
        <div class="col" style="flex: 1; min-height: 75px; border: 1px solid #ddd;">Column 2</div>
      </div>`,
      category: "Columns",
    });

    // 3 Columns Block
    editor.BlockManager.add("3-col-block", {
      label: "3 Columns",
      content: `
      <div class="row" style="display: flex;">
        <div class="col" style="flex: 1; min-height: 75px; border: 1px solid #ddd; margin-right: 10px;">Column 1</div>
        <div class="col" style="flex: 1; min-height: 75px; border: 1px solid #ddd; margin-right: 10px;">Column 2</div>
        <div class="col" style="flex: 1; min-height: 75px; border: 1px solid #ddd;">Column 3</div>
      </div>`,
      category: "Columns",
    });
  };

  return <div id="gjs" ref={editorRef}></div>;
};

export default GrapesJSEditor;
