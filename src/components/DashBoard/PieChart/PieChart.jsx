import React from "react";
import ReactApexChart from "react-apexcharts";
import { barTable } from "../../../config";

export default function PieChart({ data, id }) {
  // Check if data and data.Table are defined
  const foundData = barTable.find((item) => item.Id === id);
  if (!data || !data.Table || data.Table.length === 0) {
    return 
  }

  // Extract values from the object and replace null values with 0
  const chartData = Object.values(data.Table[0]).map((value) =>
    value !== null ? value : 0
  );

  // Extract keys as labels
  const chartLabels = Object.keys(data.Table[0]);

  // Check if chartData and chartLabels are not empty
  if (chartData.length === 0 || chartLabels.length === 0) {
    return 
  }

  // Customize chart options
  const chartOptions = {
    labels: chartLabels,
    colors: ["#008FFB", "#FF4560", "#FEB019", "#00E396"], // Customize colors as needed
    title: {
      text: `${foundData.chartName.toUpperCase()}`,
      align: "center", // Align the title to the center
      style: {
        fontSize: "16px", // Customize the font size as needed
        color: "#000", // Customize the font color as needed
        offsetY: -10, // Offset the title above the chart
      },
    },
    legend: {
      position: "top", // Place the labels at the top
    },
  };

  return (
    <div className="donut-chart-container">
      <div className="chart-content">
        <ReactApexChart
          options={chartOptions}
          series={chartData}
          type="donut"
          height={400}
        />
      </div>
    </div>
  );
}
