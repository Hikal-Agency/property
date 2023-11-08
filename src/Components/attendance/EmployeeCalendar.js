import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useStateContext } from "../../context/ContextProvider";
import "../../styles/index.css";
import AlterTimingPopup from "./AlterTimingPopup";
import moment from "moment";

const EmployeeCalendar = ({ isOffDay, pageState }) => {
  const { currentMode, primaryColor } = useStateContext();
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: "dayGridMonth",
      height: "90vh",
      //   selectable: true,
      //   select: function (start, end, allDays) {
      //     if (isOffDay(start)) {
      //       setSelectedDate(null); // Clear selectedDate if off-day is clicked
      //     } else {
      //       setSelectedDate(start);
      //     }
      //   },
      dayCellDidMount: function (args) {
        const dayElement = args.el; // Use args.el instead of args.dayEl
        const dayDate = args.date;
        const today = new Date();

        if (isOffDay(dayDate)) {
          currentMode === "dark"
            ? (dayElement.style.backgroundColor = "rgba(255,0,0,0.3)")
            : (dayElement.style.backgroundColor = "rgba(255,0,0,0.3)");
        }

        if (
          dayDate.getDate() === today.getDate() &&
          dayDate.getMonth() === today.getMonth() &&
          dayDate.getFullYear() === today.getFullYear()
        ) {
          dayElement.style.backgroundColor = primaryColor; // Red color for today's date
          dayElement.style.color = "white";
        }
      },
      events: formatEvents(pageState?.data),
    });
    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, [isOffDay, pageState]);

  //   const formatEvents = (pageState) => {
  //     // Format your pageState data into FullCalendar events
  //     const events = [];

  //     for (const data of pageState.data) {
  //       const checkDatetime = moment(data.check_datetime);
  //       const checkIn = data.checkIn; // Adjust this based on your data structure
  //       const checkOut = data.checkOut; // Adjust this based on your data structure

  //       if (checkIn && checkOut && checkDatetime.isValid()) {
  //         events.push({
  //           title: `Check-in: ${checkIn}, Check-out: ${checkOut}`,
  //           start: checkDatetime.toISOString(), // Use the datetime from your data
  //           end: checkDatetime.toISOString(), // Use the datetime from your data
  //         });
  //       } else if (checkIn && checkDatetime.isValid()) {
  //         events.push({
  //           title: `Check-in: ${checkIn}`,
  //           start: checkDatetime.toISOString(), // Use the datetime from your data
  //         });
  //       } else if (checkOut && checkDatetime.isValid()) {
  //         events.push({
  //           title: `Check-out: ${checkOut}`,
  //           start: checkDatetime.toISOString(), // Use the datetime from your data
  //         });
  //       }
  //     }

  //     return events;
  //   };
  console.log("pagestate in emp calendar:: ", pageState);

  const formatEvents = (pageState) => {
    const events = [];

    for (const data of pageState) {
      const checkDatetime = moment(data.check_datetime);
      const date = checkDatetime.format("YYYY-MM-DD");
      const checkIn = data.checkIns;
      const checkOut = data.checkOuts;

      if (checkIn && checkDatetime.isValid()) {
        events.push({
          title: `Check-in: ${checkIn}`,
          start: checkDatetime.toISOString(),
        });
      }

      if (checkOut && checkDatetime.isValid()) {
        events.push({
          title: `Check-out: ${checkOut}`,
          start: checkDatetime.toISOString(), // Use the datetime from your data
        });
      }
    }

    return events;
  };

  return (
    <div ref={calendarRef}>
      {/* {selectedDate && (
        <AlterTimingPopup
          date={selectedDate}
          isOffDay={isOffDay}
          onClose={() => setSelectedDate(null)}
        />
      )} */}
    </div>
  );
};

export default EmployeeCalendar;
