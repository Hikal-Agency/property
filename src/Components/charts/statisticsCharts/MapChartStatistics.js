import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import "./styling.css";
// const MapChartStatistics = ({ locationData }) => {
//   console.log("location map: ", locationData);
//   useEffect(() => {
//     // Create root and chart
//     let root = am5.Root.new("chartdiv");
//     let chart = root.container.children.push(
//       am5map.MapChart.new(root, {
//         panX: "rotateX",
//         projection: am5map.geoNaturalEarth1(),
//       })
//     );

//     // Create polygon series
//     let polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: am5geodata_worldLow,
//         exclude: ["AQ"],
//       })
//     );

//     // Clean up the chart when the component is unmounted
//     return () => {
//       chart.dispose();
//       root.dispose();
//     };
//   }, []);

//   return <div id="chartdiv" style={{ width: "100%" }} className="h-full" />;
// };

// const MapChartStatistics = ({ locationData }) => {
//   console.log("location map: ", locationData);

//   useEffect(() => {
//     // Create root and chart
//     let root = am5.Root.new("chartdiv");
//     let chart = root.container.children.push(
//       am5map.MapChart.new(root, {
//         panX: "rotateX",
//         projection: am5map.geoNaturalEarth1(),
//       })
//     );

//     // Create polygon series
//     let polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: am5geodata_worldLow,
//         exclude: ["AQ"],
//       })
//     );

//     // Create point series for markers
//     let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

//     pointSeries.events.on("ready", function () {
//       let pointTemplate = pointSeries.mapPoints.template;

//       // Creating a marker on the map
//       pointTemplate.propertyFields.latitude = "latitude";
//       pointTemplate.propertyFields.longitude = "longitude";

//       // Adding data to pointSeries
//       let markerData = locationData?.geo_locations?.places?.map((place) => ({
//         latitude: place.latitude,
//         longitude: place.longitude,
//       }));

//       pointSeries.data.setAll(markerData);
//     });

//     // Clean up the chart when the component is unmounted
//     return () => {
//       chart.dispose();
//       root.dispose();
//     };
//   }, [locationData]); // Make sure to add 'locationData' in the dependency array

//   return <div id="chartdiv" style={{ width: "100%" }} className="h-full" />;
// };

const MapChartStatistics = ({ locationData }) => {
  return (
    <div className="w-full" style={{ maxHeight: "200px", overflow: "auto" }}>
      <table className="w-full">
        <thead>
          <tr>
            <th className="border-b border-gray-300 py-2">ID</th>
            <th className="border-b border-gray-300 py-2">Country</th>
            <th className="border-b border-gray-300 py-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {locationData?.length > 0 ? (
            locationData.flatMap((item, index) => {
              if (Array.isArray(item.geo_locations.places)) {
                return item.geo_locations.places.map((place, placeIndex) => (
                  <tr key={`${index}-${placeIndex}`}>
                    <td className="border-b border-gray-300 py-2 text-center">
                      {placeIndex}
                    </td>
                    <td className="border-b border-gray-300 py-2 text-center">
                      {place.country ? `${place.country}` : "No data"}
                    </td>
                    <td className="border-b border-gray-300 py-2 text-center">
                      {place.name ? `${place.name}` : "No data"}
                    </td>
                  </tr>
                ));
              } else if (Array.isArray(item.geo_locations.countries)) {
                return item.geo_locations.countries.map(
                  (country, countryIndex) => (
                    <tr key={`${index}-${countryIndex}`}>
                      <td className="border-b border-gray-300 py-2 text-center">
                        {countryIndex}
                      </td>
                      <td className="border-b border-gray-300 py-2 text-center">
                        {country ? `${country}` : "No data"}
                      </td>
                      <td className="border-b border-gray-300 py-2 text-center">
                        "No data"
                      </td>
                    </tr>
                  )
                );
              }
              return [];
            })
          ) : (
            <tr>
              <td
                className="border-b border-gray-300 py-2 text-center"
                colSpan="3"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MapChartStatistics;
