import React, { useState, useEffect } from 'react';

function AnalogClock({ timeString }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Parse the time from the provided timeString
  const parsedTime = new Date(timeString);

  // Calculate rotation angles for clock hands
  const secondDegrees = (currentTime.getSeconds() / 60) * 360;
  const minuteDegrees = ((currentTime.getMinutes() + secondDegrees / 360) / 60) * 360;
  const hourDegrees = ((currentTime.getHours() % 12 + minuteDegrees / 360) / 12) * 360;

  return (
    <div className="analog-clock">
      {/* Clock face */}
      <div className="clock-face">
        {/* Hour hand */}
        <div
          className="clock-hand hour-hand"
          style={{ transform: `rotate(${hourDegrees}deg)` }}
        ></div>

        {/* Minute hand */}
        <div
          className="clock-hand minute-hand"
          style={{ transform: `rotate(${minuteDegrees}deg)` }}
        ></div>

        {/* Second hand */}
        <div
          className="clock-hand second-hand"
          style={{ transform: `rotate(${secondDegrees}deg)` }}
        ></div>

        {/* Clock center */}
        <div className="clock-center"></div>
      </div>

      {/* Time display */}
      <div className="clock-time">
        <span className="clock-hour">{parsedTime.getHours()}</span>:
        <span className="clock-minute">{parsedTime.getMinutes()}</span>:
        <span className="clock-second">{parsedTime.getSeconds()}</span>
      </div>
    </div>
  );
}

export default AnalogClock;
