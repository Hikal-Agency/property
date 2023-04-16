import React, { useEffect } from 'react';
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';

const UserMapContainer = ({ meeting_location }) => {
  useEffect(() => {
    console.log("meetings and locations are");
    console.log(user_location);
  }, []);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
  }


    const [selectedMeeting, setSelectedMeeting] = React.useState(null);
    const [selectedUser, setSelectedUser] = React.useState(null);

    return (
      <>
      {(typeof window.google !== "object") ? <div>Your map is loading...</div> :
      <GoogleMap
        zoom={10}
        center={{lat: 25.22527310000002, lng: 55.280889615218406}}
        mapContainerStyle={mapContainerStyle}
        options={options}
      >
        {meetingData.map(meeting => (
          <>
            {meeting.meetingStatus === "Attended" ? (
              <MarkerF
              key={meeting.id} 
              position={{ lat: parseFloat(meeting.mLat), lng: parseFloat(meeting.mLong)}}
              icon={{
                url: "/meetingpinattended.svg",
                scaledSize: window.google ? new window.google.maps.Size(50,50) : null,
              }}
              onClick={() => {
                setSelectedMeeting(meeting);
              }} 
            />
            ) : (
              <MarkerF
              key={meeting.id} 
              position={{ lat: parseFloat(meeting.mLat), lng: parseFloat(meeting.mLong)}}
              icon={{
                url: "/meetingpin.svg",
                scaledSize: window.google ? new window.google.maps.Size(50,50) : null,
              }}
              onClick={() => {
                setSelectedMeeting(meeting);
              }} 
            />
            )}

            {selectedMeeting ? (
              <InfoWindow             
                position={{ lat: parseFloat(selectedMeeting.mLat), lng: parseFloat(selectedMeeting.mLong)}}
                onCloseClick={
                  () => {setSelectedMeeting(null);
                }}
              >
                <div>
                  <h1>{selectedMeeting.leadName}</h1>
                  <h1 className="font-semibold">{selectedMeeting.project}&nbsp;{selectedMeeting.enquiryType}&nbsp;{selectedMeeting.leadType}</h1>
                  <h1>{selectedMeeting.meetingTime}&nbsp;{selectedMeeting.meetingDate}</h1>
                  <h1 className="font-semibold">{selectedMeeting.userName}</h1>
                </div>
              </InfoWindow>
            ) : null}
            
            
          </>
        ))}

        {userData.map(user => (
          <>
            <MarkerF
              key={user.userId} 
              position={{ lat: parseFloat(user.last_location_lat), lng: parseFloat(user.last_location_long)}}
              icon={{
                url: "/userpin.svg",
                scaledSize: window.google ? new window.google.maps.Size(50,50) : null,
              }}
              onClick={() => {
                setSelectedUser(user);
              }} 
            />

            {selectedUser ? (
              <InfoWindow
                position={{ lat: parseFloat(selectedUser.last_location_lat), lng: parseFloat(selectedUser.last_location_long)}}
                onCloseClick={
                  () => {setSelectedUser(null);
                }}
              >
                <div>
                  <h1 className="font-semibold">{selectedUser.userName}</h1>
                  <h1>Last updated: {selectedUser.lastTime}</h1>
                </div>
              </InfoWindow>
            ) : null}
            
            
          </>
        ))}

      </GoogleMap>
      }
      </>
    );
}

export default UserMapContainer;



