import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { MenuItem, Select } from '@mui/material';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(moment());
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');

  useEffect(() => {
    // Fetch all timezones
    const fetchedTimezones = moment.tz.names();
    setTimezones(fetchedTimezones);

    // Set default timezone
    setSelectedTimezone(moment.tz.guess());

    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  return (
    <div>
      <div className="flex items-center mr-2">
        <h2 style={{marginRight: 8, fontSize: 14}}>{currentTime.format('D/MM/YYYY, h:mm:ss a [GMT]Z')}</h2>
         <Select className='time-zone-select' sx={{padding: 0, "& .MuiSelect-select": {
            padding: "0 25px 0 5px !important", 
         }}} size="small" value={selectedTimezone} onChange={handleTimezoneChange}>
          {timezones.map((timezone) => (
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
