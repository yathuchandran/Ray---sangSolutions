import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { getAttendanceProject } from "../../api/apiCall";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import customIconUrl from "../../assets/images/location.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loader from "../Loader/Loader";
import Footer from "../Footer/Footer";

// Create a new icon instance
const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [35, 35], // Size of the icon
  iconAnchor: [17, 35], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -35], // Point from which the popup should open relative to the iconAnchor
});

export default function AttendanceManagerProject() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLoaderClose = () => {
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAttendanceProject({});
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setData(myObject);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error(error);
      } finally {
        handleLoaderClose();
      }
    };

    fetchData();
  }, []);

  // Group data by project and location
  const groupedData = data.reduce((acc, item) => {
    if (item.Location) {
      const [latitude, longitude] = item.Location.split(/[ ,]+/).map(Number);
      const project = item.Project;

      if (!acc[project]) {
        acc[project] = {};
      }

      const locationKey = `${latitude},${longitude}`;
      if (!acc[project][locationKey]) {
        acc[project][locationKey] = [];
      }

      acc[project][locationKey].push(item);
    }
    return acc;
  }, {});

  return (
    <>
      <Header />
      <Box
        sx={{
          width: "auto",
          height: "100%",
          zIndex: 1,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{
            height: "90vh",
            width: "100%",
            borderRadius: 5,
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {Object.entries(groupedData).map(([project, locations]) =>
            Object.entries(locations).map(([locationKey, employees], index) => {
              const [latitude, longitude] = locationKey.split(",").map(Number);

              if (isNaN(latitude) || isNaN(longitude)) {
                return null;
              }

              return (
                <Circle
                  key={index}
                  center={[latitude, longitude]}
                  pathOptions={{ fillColor: "blue" }}
                  radius={200}
                >
                  <Marker position={[latitude, longitude]} icon={customIcon}>
                    <Circle
                      center={[latitude, longitude]}
                      pathOptions={{ fillColor: "red" }}
                      radius={100}
                      stroke={false}
                    />
                    <Popup>
                      <strong>Project:</strong> {project}
                      <br />
                      <strong>Employees:</strong>
                      <ul>
                        {employees.map((employee, idx) => (
                          <li key={idx}>
                            {employee.Employee}{" "}
                            {employee.iIsSupervisor === 1 ? "(S)" : "(E)"}
                          </li>
                        ))}
                      </ul>
                      <strong>TBTProjectCount:</strong> {employees[0]?.TBTProjectCount}
                      <br />
                      <strong>Latitude:</strong> {latitude}
                      <br />
                      <strong>Longitude:</strong> {longitude}
                    </Popup>
                  </Marker>
                </Circle>
              );
            })
          )}
        </MapContainer>
      </Box>
      <Footer />
      <Loader open={loading} handleClose={handleLoaderClose} />
    </>
  );
}
