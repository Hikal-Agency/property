import React, { useState, useEffect } from "react";

function LiveDateTimeComponent({ setAttendanceTime }) {
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newDateTime = new Date().toLocaleString();
      setCurrentDateTime(newDateTime);
      setAttendanceTime(newDateTime); // Pass the new date/time back to the parent
    }, 1000); // Updates every second

    // Clear interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, [setAttendanceTime]); // Empty dependency array means this effect runs once on mount, and cleanup runs on unmount

  return <div>{currentDateTime}</div>;
}

export default LiveDateTimeComponent;
