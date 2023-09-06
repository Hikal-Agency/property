import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

import "../../styles/clock.css";

const AnalogClock = ({ timeString, timezone }) => {
  const [time, setTime] = useState(moment(timeString));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment(timeString));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeString]);

  const getSeconds = () => {
    return time.seconds() * 6; // 360 degrees divided by 60 seconds
  };

  const getMinutes = () => {
    return (time.minutes() + time.seconds() / 60) * 6; // 360 degrees divided by 60 minutes
  };

  const getHours = () => {
    return ((time.hours() % 12) + time.minutes() / 60) * 30; // 360 degrees divided by 12 hours
  };

  const getTimeInSelectedTimezone = () => {
    return moment(time).tz(timezone).format("h:mm:ss A");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Update the time state with the current time in the selected timezone
      setTime(moment().tz(timezone));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timezone]);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="analog-clock">
        <div className="clock-face">
          <div class="clock-face-background"></div>
          <div
            className="hour-hand"
            style={{ transform: `rotate(${getHours()}deg)` }}
          ></div>
          <div
            className="minute-hand"
            style={{ transform: `rotate(${getMinutes()}deg)` }}
          ></div>
          <div
            className="second-hand"
            style={{ transform: `rotate(${getSeconds()}deg)` }}
          ></div>
          <div className="center-pin"></div>
        </div>
        {/* <div className="clock-time">{getTimeInSelectedTimezone()}</div> */}
      </div>
    </div>
  );
};

export default AnalogClock;
