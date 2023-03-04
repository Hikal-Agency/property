import React, { Component, useState } from 'react';
import { 
  GoogleMap, 
  withScriptjs, 
  withGoogleMap, 
  Marker,
  InfoWindow } from 'react-google-maps';
// import * as meetingData from "../../data/locationdata.json";

import { ImLocation } from "react-icons/im";

const mapStyles = {
  width: '100%',
  height: '100%'
};

function Map() {
  const [selectedPin, setSelectedPin] = useState(null);
  // const { main } = meetingData;

  const {MeetingIcon} = <ImLocation />;

  return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 25.2255834, lng: 55.2843141}}
    >
      {meetingData.features.map(meeting => (
        <Marker 
          key={meeting.properties.mId} 
          position={{ lat: meeting.geometrics.coordinates[0], lng: meeting.geometrics.coordinates[1]}}
          onClick={() => {
            setSelectedPin();
          }} 
          icon={{
            // MeetingIcon,
            url: "../../../public/favicon.png",
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      ))}

      {selectedPin && (
        <InfoWindow
          position={{ lat: selectedPin.geometrics.coordinates[0], lng: selectedPin.geometrics.coordinates[1]}} //selectedPin.lat&lng
          onCloseClick={() => {
            setSelectedPin(null);
          }}
        >
          <div>
            <h2>{selectedPin.properties.leadId}</h2>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

export class MapContainer extends Component {
  render() {

    return (
      <>
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBtYwXsFlL25Jct9nYMl8ytW0KiZ6q19sY`}
        loadingElement={<div style={{height: '100%'}}></div>}
        containerElement={<div style={{height: '100%'}}></div>}
        mapElement={<div style={{height: '100%'}}></div>}
      />
        
        {/* <Map
          google={this.props.google}
          zoom={14}
          style={mapStyles}
          initialCenter={{
            lat: 42.39,
            lng: -72.52
          }}
          // bounds={bounds}
        >
        </Map> */}
      </>

    );
  }
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

// export default GoogleApiWrapper({
//   apiKey: 'AIzaSyBtYwXsFlL25Jct9nYMl8ytW0KiZ6q19sY'
// })(MapContainer);

export default MapContainer;
