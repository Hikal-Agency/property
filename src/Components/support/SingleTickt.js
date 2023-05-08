import React from "react";
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

const SingleTickt = () => {
  const classes = useStyles();

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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                sit amet tellus eu odio pulvinar tristique vitae sed est. Nulla
                sed lectus mi. Cras in eros sit amet tellus posuere aliquet eu
                nec risus. Nam laoreet scelerisque sem, et ullamcorper urna.
                Pellentesque at enim vel dui porta mollis lobortis et felis.
                Morbi dapibus arcu auctor, imperdiet urna sit amet, posuere
                augue. Sed pulvinar lectus vitae tempor rutrum. Aliquam ut
                ultrices dolor. Proin dictum finibus ex, vulputate facilisis
                nunc volutpat quis. Aliquam a erat dignissim, maximus ipsum non,
                bibendum dolor. Vivamus vestibulum porta facilisis. Quisque sed
                rutrum erat. Pellentesque ut malesuada diam. Sed convallis neque
                vitae tellus feugiat, sit amet pellentesque leo viverra. In
                ultrices nunc quis dignissim mollis. Vivamus eget justo
                vulputate, rutrum massa pretium, vulputate nisl. Etiam in ex eu
                tellus tempor sollicitudin. Sed ac massa in tortor accumsan
                vulputate sed ac sapien. Quisque nec risus ligula. Vestibulum
                nec eleifend turpis. Quisque et dolor sit amet odio semper
                congue. Suspendisse mattis mollis lorem, eu dignissim augue
                blandit sodales. Phasellus auctor molestie feugiat. Aliquam
                vitae tempor nisi, in rhoncus dolor. Duis quis nisl fermentum,
                convallis ligula sit amet, lacinia orci.
              </h1>
            </CardContent>
          </Card>
          <div style={{ height: 200, overflowY: "scroll", marginTop: "20px" }}>
            <Editor
              apiKey="key"
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
            />
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
            <div className="mb-4">Ticket details</div>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography sx={{ wordWrap: "break-word" }}>
                  Ticket ID: AL837K Copy URL
                  https://app.helpdesk.com/tickets/AL837K Created: 8 May 2023
                  Last message: 8 May 2023 Status: Open Rating: Not rated
                  Priority: Medium Source: Created manually
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography sx={{ wordWrap: "break-word" }}>
                  Ticket ID: AL837K Copy URL
                  https://app.helpdesk.com/tickets/AL837K Created: 8 May 2023
                  Last message: 8 May 2023 Status: Open Rating: Not rated
                  Priority: Medium Source: Created manually
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4">
              <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                <Typography>Ticket Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography sx={{ wordWrap: "break-word" }}>
                  Ticket ID: AL837K Copy URL
                  https://app.helpdesk.com/tickets/AL837K Created: 8 May 2023
                  Last message: 8 May 2023 Status: Open Rating: Not rated
                  Priority: Medium Source: Created manually
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
