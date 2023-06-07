import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { MenuItem, Select } from '@mui/material';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(moment().tz(moment.tz.guess()).format('D/MM/YYYY, h:mm:ss a [GMT]Z'));
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());

  useEffect(() => {
    // Fetch all timezones
    const fetchedTimezones = moment.tz.names();
    setTimezones(fetchedTimezones);

    // Set default timezone
    // setSelectedTimezone(moment.tz.guess());

    // Update current time every second
    const interval = setInterval(() => {
      console.log(selectedTimezone)
      setCurrentTime(moment().tz(selectedTimezone).format('D/MM/YYYY, h:mm:ss a [GMT]Z'));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedTimezone]);

  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  return (
    <div>
      <div className="flex items-center mr-2">
        <h2 style={{marginRight: 8, fontSize: 14}}>{currentTime}</h2>
         <Select className='time-zone-select' sx={{padding: 0, "& .MuiSelect-select": {
            padding: "0 25px 0 5px !important", 
         }}} size="small" value={selectedTimezone} onChange={handleTimezoneChange}>
          {timezones?.map((timezone) => (
            <MenuItem key={timezone} value={timezone}>
              {timezone}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default Clock;
