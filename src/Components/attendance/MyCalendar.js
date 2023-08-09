import React, { useEffect, useRef } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../../styles/index.css";
import { useStateContext } from "../../context/ContextProvider";


const MyCalendar = ({ isOffDay }) => {
  const { currentMode } = useStateContext();
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin],
      initialView: "dayGridMonth",
      height: "90vh",
      selectable: true,
      select: function (start, end, allDays) {
        console.log("...clicked....");
      },
      // dayCellContent: function (args) {
      //   const dayElement = args.dayEl;
      //   const dayDate = args.date;

      //   if (isOffDay(dayDate)) {
      //     dayElement.classList.add("off-day");
      //   }
      // },
      dayCellDidMount: function (args) {
        const dayElement = args.el; // Use args.el instead of args.dayEl
        const dayDate = args.date;
        const today = new Date();

        console.log("isOffDay ========================> ", isOffDay);
        console.log("Day Element=====================> ", dayElement);
        console.log("Day Date=====================> ", dayDate);

        if (isOffDay(dayDate)) {
          currentMode === "dark" 
          ? dayElement.style.backgroundColor = "#946668"
          : dayElement.style.backgroundColor = "#facdcf";
        }

        if (
          dayDate.getDate() === today.getDate() &&
          dayDate.getMonth() === today.getMonth() &&
          dayDate.getFullYear() === today.getFullYear()
        ) {
          dayElement.style.backgroundColor = "#DA1F26"; // Red color for today's date
          dayElement.style.color = "white";
        }
      },
    });
    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, [isOffDay]);

  const handleEventClick = (info) => {
    alert("Event: " + info.event.title);
    alert("Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY);
    alert("View: " + info.view.type);

    // change the border color just for fun
    info.el.style.borderColor = "red";
  };

  return <div ref={calendarRef} className={`${currentMode === "dark" ? "custom-dark-calendar" : ""}`}></div>;
};

export default MyCalendar;
