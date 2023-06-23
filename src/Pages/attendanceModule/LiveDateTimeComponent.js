import React, { useState, useEffect } from "react";

function LiveDateTimeComponent({ setAttendanceTime }) {
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newDateTime = new Date().toLocaleString();
      setCurrentDateTime(newDateTime);
      setAttendanceTime(newDateTime);
    }, 1000); // Updates every second

    // Clear interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, [setAttendanceTime]);

  return <div>{currentDateTime}</div>;
}

export default LiveDateTimeComponent;
