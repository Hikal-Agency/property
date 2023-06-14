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

const MapChartStatistics = ({ locationData }) => {
  console.log("location map: ", locationData);

  useEffect(() => {
    // Create root and chart
    let root = am5.Root.new("chartdiv");
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        projection: am5map.geoNaturalEarth1(),
      })
    );

    // Create polygon series
    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
      })
    );

    // Create point series for markers
    let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.events.on("ready", function () {
      let pointTemplate = pointSeries.mapPoints.template;

      // Creating a marker on the map
      pointTemplate.propertyFields.latitude = "latitude";
      pointTemplate.propertyFields.longitude = "longitude";

      // Adding data to pointSeries
      let markerData = locationData?.geo_locations?.places?.map((place) => ({
        latitude: place.latitude,
        longitude: place.longitude,
      }));

      pointSeries.data.setAll(markerData);
    });

    // Clean up the chart when the component is unmounted
    return () => {
      chart.dispose();
      root.dispose();
    };
  }, [locationData]); // Make sure to add 'locationData' in the dependency array

  return <div id="chartdiv" style={{ width: "100%" }} className="h-full" />;
};

// const MapChartStatistics = ({ locationData }) => {
//   useEffect(() => {
//     let root = am5.Root.new("chartdiv");

//     let chart = root.container.children.push(
//       am5map.MapChart.new(root, {
//         panX: "rotateX",
//         projection: am5map.geoNaturalEarth1(),
//       })
//     );

//     let polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: am5geodata_worldLow,
//         exclude: ["AQ"],
//       })
//     );

//     let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

//     let circleTemplate = am5.Template.new({
//       radius: 5,
//       fill: root.interfaceColors.get("primaryButtonBackground"),
//       strokeWidth: 2,
//       stroke: root.interfaceColors.get("primaryButtonStroke"),
//     });
//     pointSeries.bullets.template.setAll(circleTemplate);

//     let markerData = locationData?.flatMap((item) =>
//       item.geo_locations?.places?.map((place) => ({
//         latitude: place.latitude,
//         longitude: place.longitude,
//       }))
//     );

//     if (markerData && markerData.length > 0) {
//       pointSeries.data.setAll(markerData);
//     }

//     return () => {
//       root.dispose();
//       chart.dispose();
//     };
//   }, [locationData]);

//   return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
// };

export default MapChartStatistics;
