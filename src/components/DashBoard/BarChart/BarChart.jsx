import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "./BarChart.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getModalApi } from "../../../api/dashboardApi";
import { barTable } from "../../../config";
import ModalTable from "../Modal/ModalTable";
import Loader from "../../Loader/Loader";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const chartOrder = [
  "M_Project",
  "Y_Project",
  "A_Project",
  "M_Employee",
  "Y_Employee",
  "A_Employee",
];

const keyToStatusMapping = {
  M_Project: 1,
  Y_Project: 2,
  A_Project: 3,
  M_Employee: 1,
  Y_Employee: 2,
  A_Employee: 3,
};

const BarChart = ({ data, id }) => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [chartType, setChartType] = useState();
  const [values, setValues] = useState();
  const [status, setStatus] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [titleName, setTitleName] = useState("");

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleOpenAlert = () => setWarning(true);

  const handleAction = async (value, graphKey) => {
    try {
      const commonParams = {
        path: foundData.pathName,
        DisplayLength: 0,
        DisplayStart: 0,
        iType: foundData.iType,
        iGraphType: statusByGraphKey[graphKey],
      };

      handleOpen();

      if (value && statusByGraphKey[graphKey]) {
        let title, specificParams;

        if (value?.sProject) {
          title = "PROJECT WISE";
          specificParams = {
            iProject: value.iProject,
            iEmployee: 0,
          };
        } else if (value?.sEmployee) {
          title = "EMPLOYEE WISE";
          specificParams = {
            iProject: 0,
            iEmployee: value.iEmployee,
          };
        }

        if (title && specificParams) {
          setTitleName(title);
          const response = await getModalApi({
            ...commonParams,
            ...specificParams,
          });
          setModalData(response);
          handleOpenModal();
        } else {
          handleCloseModal();
          setModalData([]);
        }
      }

      handleClose();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const foundData = barTable.find((item) => item.Id === id);

  const statusByGraphKey = {};

  const charts = chartOrder.map((key) => {
    if (data && typeof data === "object" && data.hasOwnProperty(key)) {
      const chartData = data[key];

      if (!chartData) {
        return <div key={key}></div>;
      }

      const chartLabels = chartData.map(
        (item) => item?.sEmployee || item?.sProject
      );

      const countName = key.includes("M_")
        ? foundData.M_countName
        : key.includes("Y_")
        ? foundData.Y_countName
        : key.includes("A_")
        ? foundData.A_countName
        : null;

      const chartValues = chartData.map((item) => {
        if (item && item[countName] !== undefined) {
          return item[countName];
        } else {
          return 0;
        }
      });

      let titleText = "";
      if (key.includes("M_")) {
        titleText = "CURRENT MONTH";
      } else if (key.includes("Y_")) {
        titleText = "CURRENT YEAR";
      } else if (key.includes("A_")) {
        titleText = "TILL DATE";
      }

      const options = {
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: false,
          },
          animations: {
            enabled: false,
          },
          events: {
            click: function (chart, w, e) {
              const clickedDataPointIndex = e.dataPointIndex;
              const clickedValue = chartData[clickedDataPointIndex];
              if (foundData) {
                const graphKey = key;
                setChartType(graphKey);
                setValues(clickedValue);
                handleAction(clickedValue, graphKey);
                setStatus(keyToStatusMapping[key]);
              }
            },
          },
        },
        title: {
          text: titleText,
          align: "center",
          style: {
            fontSize: "16px",
            color: "#000",
            offsetY: -10,
            fontWeight: "normal",
          },
        },
        legend: {
          position: "top",
          show: false,
        },
        xaxis: {
          categories: chartLabels,
          labels: {
            style: {
              fontSize: "10px",
            },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "80%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
      };

      const series = [
        {
          name: foundData.A_countName.slice(2),
          data: chartValues,
        },
      ];

      statusByGraphKey[key] = keyToStatusMapping[key];

      return (
        <div
          key={key}
          className="chart-container"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
        >
          <div className="chart">
            <ReactApexChart options={options} series={series} type="bar" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      {data && (
        <>
          <div className="charts-group">
            <div className="group-header">
              <h5
                className="p-3 text-normal"
                style={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {foundData.chartName} PROJECT WISE
              </h5>
            </div>
            <div className="charts-container">
              {charts.slice(0, 3).map((chart, index) => (
                <div key={index} className="chart-container">
                  <div className="chart">{chart}</div>
                </div>
              ))}
            </div>
          </div>

          {charts.length > 3 && (
            <div className="charts-group">
              <div className="group-header">
                <h5
                  className="p-3 text-normal"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {foundData.chartName} EMPLOYEE WISE
                </h5>
              </div>
              <div className="charts-container">
                {charts.slice(3).map((chart, index) => (
                  <div key={index} className="chart-container">
                    <div className="chart">{chart}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ModalTable
        isOpen={isModalOpen}
        data={modalData}
        handleCloseModal={handleCloseModal}
        values={values}
        chartType={chartType}
        status={status}
        foundData={foundData}
        titleText={titleName}
      />

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </div>
  );
};

export default BarChart;
