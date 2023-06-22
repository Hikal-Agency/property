import React, { useState, useEffect } from 'react';

function LiveDateTimeComponent() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000); // Updates every second

    // Clear interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []); // Empty dependency array means this effect runs once on mount, and cleanup runs on unmount

  return (
    <div>{currentDateTime}</div>
  );
}

export default LiveDateTimeComponent;
