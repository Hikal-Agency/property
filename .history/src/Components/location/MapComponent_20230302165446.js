import React, { Component, useState } from 'react';
import { 
  GoogleMap, 
  withScriptjs, 
  withGoogleMap, 
  Marker,
  InfoWindow } from 'react-google-maps';
import meetingData from "../../data/locationdata.json";

const mapStyles = {
  width: '100%',
  height: '100%'
};

function Map() {
  const [selectedPin, setSelectedPin] = useState(null);
  // const { main } = meetingData;

  return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 25.2255834, lng: 55.2843141}}
    >
      {meetingData.features.map(meeting => (
        <Marker 
          key={meeting.properties.mId} 
          position={{ lat: meeting.geometrics.coordinates[0], lng: meeting.geometrics.coordinates[1]}}
          // onClick={() => {
          //   setSelectedPin();
          // }} 
        />
      ))}

      {selectedPin && (
        <InfoWindow
          position={{ lat: "25.2255834", lng: "55.2843141"}} //selectedPin.lat&lng
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

    // var points = [
    //   { lat: 42.02, lng: -77.01 },
    //   { lat: 42.03, lng: -77.02 },
    //   { lat: 41.03, lng: -77.04 },
    //   { lat: 42.05, lng: -77.02 }
    // ]
    // var bounds = new this.props.google.maps.LatLngBounds();
    // for (var i = 0; i < points.length; i++) {
    //   bounds.extend(points[i]);
    // }


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
