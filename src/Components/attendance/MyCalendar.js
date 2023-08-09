import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin from '@fullcalendar/interaction'; 
import dayGridPlugin from "@fullcalendar/daygrid";
import { useStateContext } from "../../context/ContextProvider";
import "../../styles/index.css";
import AlterTimingPopup from "./AlterTimingPopup";


const MyCalendar = ({ isOffDay }) => {
  const { currentMode } = useStateContext();
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: "dayGridMonth",
      height: "90vh",
      selectable: true,
      select: function (start, end, allDays) {
        if (isOffDay(start)) {
          setSelectedDate(null); // Clear selectedDate if off-day is clicked
        } else {
          setSelectedDate(start);
        }
      },
      dayCellDidMount: function (args) {
        const dayElement = args.el; // Use args.el instead of args.dayEl
        const dayDate = args.date;
        const today = new Date();

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

  return (
    <div ref={calendarRef} className={`${currentMode === "dark" ? "custom-dark-calendar" : ""}`}>
      {selectedDate && 
        <AlterTimingPopup date={selectedDate} isOffDay={isOffDay} onClose={() => setSelectedDate(null)} />
      }
    </div>
  );
};

export default MyCalendar;
