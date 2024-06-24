import React, { useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { load } from '../../Pages/App';

const UserMapContainer = ({ user_location }) => {
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

    return (
      <>
      {!load?.isLoaded ? <div>Your map is loading...</div> :
      <GoogleMap
        zoom={10}
        center={{lat: 25.22527310000002, lng: 55.280889615218406}}
        mapContainerStyle={mapContainerStyle}
        options={options}
      >
        {/* {userData.map(user => (
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
        ))} */}

      </GoogleMap>
      }
      </>
    );
}

export default UserMapContainer;



