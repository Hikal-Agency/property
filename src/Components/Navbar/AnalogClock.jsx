import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useStateContext } from "../../context/ContextProvider";

import "../../styles/clock.css";

// const AnalogClock = ({ timeString, timezone }) => {
//   const { currentMode } = useStateContext();
//   const [time, setTime] = useState(moment(timeString));

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTime(moment(timeString));
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [timeString]);

//   const getSeconds = () => {
//     return time.seconds() * 6; // 360 degrees divided by 60 seconds
//   };

//   const getMinutes = () => {
//     return (time.minutes() + time.seconds() / 60) * 6; // 360 degrees divided by 60 minutes
//   };

//   const getHours = () => {
//     return ((time.hours() % 12) + time.minutes() / 60) * 30; // 360 degrees divided by 12 hours
//   };

//   const getTimeInSelectedTimezone = () => {
//     return moment(time).tz(timezone).format("h:mm:ss A");
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Update the time state with the current time in the selected timezone
//       setTime(moment().tz(timezone));
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [timezone]);

//   return (
//     <div className="w-full flex items-center justify-center">
//       <div className="analog-clock">
//         <div className="clock-face">
//           <div
//             class={`${
//               currentMode === "dark" ? "dark-mode" : "light-mode"
//             } clock-face-background`}
//           ></div>
//           <div
//             className="hour-hand"
//             style={{
//               transform: `rotate(${getHours()}deg)`,
//               background: currentMode === "dark" ? "#FFFFFF" : "#000000",
//             }}
//           ></div>
//           <div
//             className="minute-hand"
//             style={{
//               transform: `rotate(${getMinutes()}deg)`,
//               background: currentMode === "dark" ? "#FFFFFF" : "#000000",
//             }}
//           ></div>
//           <div
//             className="second-hand"
//             style={{ transform: `rotate(${getSeconds()}deg)` }}
//           ></div>
//           <div
//             className="center-pin"
//             style={{
//               background: currentMode === "dark" ? "#FFFFFF" : "#000000",
//             }}
//           ></div>
//         </div>
//         {/* <div className="clock-time">{getTimeInSelectedTimezone()}</div> */}
//       </div>
//     </div>
//   );
// };

const AnalogClock = ({ timeString, timezone }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [time, setTime] = useState(moment(timeString));

  useEffect(() => {
    const dailer = (selector, size) => {
      for (let s = 0; s < 60; s++) {
        const span = document.createElement('span');
        span.style.transform = `rotate(${6 * s}deg) translateX(${size}px)`;
        span.textContent = s;
        document.querySelector(selector).appendChild(span);
      }
    }

    const getTime = () => {
      // const date = moment(timeString, 'DD/MM/YYYY, h:mm:ss a [GMT]Z');

      // const second = date.seconds();
      // const minute = date.minutes();
      // const hour = date.hours();
      // const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      // const day = date.day();
      // const month = date.month();
      // const formattedDate = months[month] + ' ' + date.date();

      const date = moment.tz(timeString, "DD/MM/YYYY, h:mm:ss a", timezone);

      const second = date.seconds();
      const minute = date.minutes();
      const hour = date.hours();
      const time = date.format("h:mm:ss A");
      const day = date.day();
      const month = date.month();
      const formattedDate = months[month] + ' ' + date.date();

      document.querySelector('.second').style.transform = `rotate(${-6 * second}deg)`;
      document.querySelector('.minute').style.transform = `rotate(${-6 * minute}deg)`;
      document.querySelector('.hour').style.transform = `rotate(${-30 * hour}deg)`;

      document.querySelector('.time').textContent = time;
      document.querySelector('.day').textContent = days[day];
      document.querySelector('.date').textContent = formattedDate;
    }

    dailer('.second', 98);
    dailer('.minute', 75);
    dailer('.dail', 115);

    for (let s = 1; s < 13; s++) {
      const span = document.createElement('span');
      span.style.transform = `rotate(${30 * s}deg) translateX(50px)`;
      span.textContent = s;
      document.querySelector('.hour').appendChild(span);
    }

    const interval = setInterval(getTime, 1000);

    getTime();

    return () => clearInterval(interval);
  }, [timeString, timezone]);

  return (
    <>
      <div className="clock-container">
        <div className="clock-digital">
          <div className="date"></div>
          <div className="time"></div>
          <div className="day"> </div>
        </div>
        <div className="clock-analog">
          <div className="spear"></div>
          <div className="hour"></div>
          <div className="minute"></div>
          <div className="second"></div>
          <div className="dail"></div>
        </div>
      </div>
    </>
  )
};

export default AnalogClock;
