import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import "./styling.css";
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

    // Clean up the chart when the component is unmounted
    return () => {
      chart.dispose();
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%" }} className="h-full" />;
};

export default MapChartStatistics;
