// import React, { useEffect } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5map from "@amcharts/amcharts5/map";
// import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

// const MapChartStatistics = () => {
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

//   return <div id="chartdiv" style={{ width: "100%", height: "500px" }} />;
// };

// export default MapChartStatistics;

import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";

const MapChartStatistics = () => {
  useEffect(() => {
    // Create root and chart
    let root = am5.Root.new("chartdiv");
    let chart = root.container.children.push(am5map.MapChart.new(root));

    // Create line series
    let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));

    let route = lineSeries.pushDataItem({
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.778137, 40.641312],
          [-0.454296, 51.47002],
          [116.597504, 40.072498],
        ],
      },
    });

    // Create point series
    let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(0xff0000),
        }),
      });
    });

    let plane = pointSeries.pushDataItem({
      lineDataItem: route,
      positionOnLine: 0.7,
      autoRotate: true,
    });
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default MapChartStatistics;
