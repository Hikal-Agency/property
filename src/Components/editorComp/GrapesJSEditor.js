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

  return <div id="gjs" ref={editorRef}></div>;
};

export default GrapesJSEditor;
