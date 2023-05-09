import React, { useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Typography,
  styled,
} from "@mui/material";
import { BsChevronCompactDown } from "react-icons/bs";
import { Editor } from "@tinymce/tinymce-react";
import { useLocation } from "react-router-dom";

const useStyles = styled({
  root: {
    display: "flex",
    width: "100%",
    height: "3000px",
    backgroundColor: "#F7FAFC",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    textAlign: "center",
    overflowY: "auto",
  },
});

const SingleTickt = ({ ticketData }) => {
  console.log("Single tkt : ", ticketData);
  const handleEditorChange = (content, editor) => {
    console.log("Content was updated:", content);
  };

  function getStatusColorClass(status) {
    switch (status) {
      case "open":
        return "text-green-500";
      case "in Process":
        return "text-blue-500";
      case "pending":
        return "text-yellow-500";
      case "paused":
        return "text-orange-500";
      case "closed":
        return "text-red-500";
      case "resolved":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  }

  const handleFilePicker = (callback, value, meta) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];

        const formData = new FormData();
        formData.append("file", file);

        try {
          // Make a request to upload the image
          const response = await fetch(
            "https://your-api-url.com/upload-image",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          if (response.ok) {
            callback(data.url, { title: file.name });
          } else {
            console.error("Failed to upload image");
          }
        } catch (error) {
          console.error(error);
        }
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };
  const classes = useStyles();

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const { currentMode } = useStateContext();

  const [loading, setloading] = useState(false);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-3">
        <div
          className={`${
            currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"
          } w-full h-[85vh] col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}
        >
          <Card
            className={classes.root}
            sx={{ height: "400px", overflowY: "auto" }}
          >
            <CardContent className={classes.content}>
              <h1 className="text-xl font-bold text-gray-700">
                {ticketData?.description}
              </h1>
            </CardContent>
          </Card>
          <div style={{ height: 200, overflowY: "scroll", marginTop: "20px" }}>
            {/* <Editor
              apiKey="asb4zu1qlqrydo9vhg8yo2co2t7kjhb2efga5v04gl0ejx35"
              init={{
                height: 500,
                menubar: false,
                statusbar: false,
                toolbar:
                  "undo redo | " +
                  "bold italic strikethrough | numlist " +
                  "removeformat",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            /> */}
            {/* <Editor
              apiKey="asb4zu1qlqrydo9vhg8yo2co2t7kjhb2efga5v04gl0ejx35"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue="<p>This is the initial content of the editor.</p>"
              init={{
                height: 500,
                menubar: false,
                selector: "textarea",
                plugins: [
                  "advlist autolink lists link  charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount image",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help | image",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                images_file_types: "jpg,svg,webp",
              }}
            /> */}

            <Editor
              apiKey="asb4zu1qlqrydo9vhg8yo2co2t7kjhb2efga5v04gl0ejx35"
              initialValue="<p>This is the initial content of the editor.</p>"
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "print",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "paste",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify |" +
                  "bullist numlist outdent indent | link image | code | preview | fullscreen",
                file_picker_types: "image",
                file_picker_callback: handleFilePicker,
              }}
              onEditorChange={handleEditorChange}
            />

            <button onClick={log}>Log editor content</button>
          </div>
        </div>
        {/* <div className="h-full w-full">
          <div
            className="grid grid-cols-1 gap-5"
            sx={{ height: "40px", overflowY: "auto" }}
          >
            Ticket details
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography> ticket id</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography> ticket id</Typography>
                <hr />
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography> ticket id</Typography>
                <hr />
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography> ticket id</Typography>
                <hr />
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography> ticket id</Typography>
                <hr />
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography> ticket id</Typography>
                <hr />
              </AccordionDetails>
            </Accordion>
          </div>
        </div> */}
        <div className="h-full w-full">
          <div className="grid grid-cols-1 gap-5 overflow-y-auto h-[400px]">
            <div className="mb-2">Ticket details</div>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography sx={{ wordWrap: "break-word" }}>
                  <b> Ticket ID: </b>
                  {ticketData?.id} <br />
                  <b>Created: </b> {ticketData?.created_ad} <br />
                  <b>Status: </b>
                  <span className={getStatusColorClass(ticketData?.status)}>
                    {ticketData?.status}
                  </span>
                  <br />
                  <b> Source: </b> {ticketData?.source}
                  <br />
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Responsibility</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography sx={{ wordWrap: "break-word" }}>
                  <b> Added By: </b> {ticketData?.added_by} <br />
                  <b> Assigned to: </b> {ticketData?.assigned_to || "No one"}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleTickt;
