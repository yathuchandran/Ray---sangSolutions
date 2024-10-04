import React, { useEffect, useState } from "react";
import { GetCountGraph } from "../../api/dashboardApi";
import { MDBCard } from "mdb-react-ui-kit";
import { CButton } from "@coreui/react";
import PieChart from "./PieChart/PieChart";
import BarChart from "./BarChart/BarChart";
import Loader from "../Loader/Loader";
import { barTable } from "../../config";

export default function Label({ actions }) {
  const [id, setId] = useState(null);
  const [chartType, setChartType] = useState(null);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [filterData, setFilterData] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleButtonClick = async (value, type) => {
    try {
      setId(value);
      setChartType(type);
      handleOpen();
      const response = await GetCountGraph(value);
      if (response.Status === "Success") {
        const parsedData = JSON.parse(response.ResultData);
        setData(parsedData);
      }
      handleClose();
    } catch (error) {
      console.error("Error fetching data:", error);
      handleClose();
    }
  };



  useEffect(() => {
    const filterBarTable = (barTable, actions) => {
      return barTable.filter(barItem => 
        actions.some(action => action.iScreenId === barItem.iScreenId)
      );
    };
    const filteredBarTable = filterBarTable(barTable, actions);
    setFilterData(filteredBarTable);
    if (filteredBarTable.length > 0) {
      handleButtonClick(filteredBarTable[0].Id, filteredBarTable[0].chartType);
    }
  }, [actions]);

  return (
    <MDBCard
      className="text-center mb-5"
      style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
    >
      <div
        className="button-container pb-2"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "10px",
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: "#888 #f5f5f5", // Firefox
        }}
      >
        <div
          className="button-group m-2"
          style={{
            display: "inline-flex",
          }}
        >
          {filterData.map((barData) => (
            <CButton
              key={barData.Id}
              onClick={() => handleButtonClick(barData.Id, barData.chartType)}
              className={`dashboard-button  ${
                id === barData.Id ? "active" : ""
              }`}
              shape="rounded-pill"
              color="white"
              style={{
                marginRight: "10px",
                height: "40px",
                width: "auto",
                minWidth: "120px",
                textTransform: "none",
                backgroundColor: `${barData?.colorBg}`,
                color: "white",
              }}
            >
              {barData.chartName}
            </CButton>
          ))}
        </div>
      </div>
      <div className="chart-container" style={{ minHeight: "auto" }}>
        {chartType === "PIE" && data ? (
          <PieChart id={id} data={data} />
        ) : chartType === "BAR" && data ? (
          <BarChart id={id} data={data} />
        ) : null}
      </div>
      <Loader open={open} handleClose={handleClose} />
    </MDBCard>
  );
}
