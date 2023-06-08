import React, { useEffect, useRef } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

const MyCalendar = () => {
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin],
      initialView: "dayGridMonth",
      height: "90vh",
      eventClick: function(start,end,allDays){
        console.log("...clicked....")
      },
    });
    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, []);

  const handleEventClick = (info) => {
    alert("Event: " + info.event.title);
    alert("Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY);
    alert("View: " + info.view.type);

    // change the border color just for fun
    info.el.style.borderColor = "red";
  };

  return <div ref={calendarRef}></div>;
};

export default MyCalendar;
