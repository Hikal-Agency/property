import React, { Component } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from 'react-google-maps';
import * as uaeData from "../../data/uae.json";

const mapStyles = {
  width: '100%',
  height: '100%'
};

function Map() {
  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: 25.2255834, lng: 55.2843141}}
    >
      {/* {uaeData.objects.map((object) => ( */}
        <Marker 
          key={"960"} 
          position={{ lat: "25.2255834", lng: "55.2843141"}}
          onClick={() => {

          }} />
      {/* ))} */}
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
