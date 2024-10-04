import React, { useEffect, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import customIconUrl from "../../assets/images/location.png";

// Create a new icon instance
const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [35, 35], // Size of the icon
  iconAnchor: [17, 35], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -35], // Point from which the popup should open relative to the iconAnchor
});

function ClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null; // Return null since this is a functional component
}

const ProjectMap = ({ location, handleLocation }) => {
  const [position, setPosition] = useState([]); // Set default state value to null

  useEffect(() => {
    if (typeof location === "string" && location.split(",").length === 2) {
      const [lat, lng] = location.split(",").map(Number); // Ensure conversion to number
      setPosition([lat, lng]);
    } else {
      setPosition([]);
    }
  }, [location]);

  useEffect(() => {
    if (position && position.length === 2) {
      handleLocation(position);
    }
  }, [position]);

  return (
    <Box
      sx={{
        width: "auto",
        zIndex: 1,
        backgroundColor: "#ffff",
        borderRadius: 2,
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
      }}
    >
      <MapContainer
        center={position.length === 2 ? position : [0, 0]}
        zoom={position.length === 2 ? 13 : 2}
        style={{
          height: "455px",
          width: "100%",
          borderRadius: 5,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; "
        />

        {position.length === 2 && (
          <Circle
            center={position}
            pathOptions={{ fillColor: "blue" }}
            radius={200}
          >
            <Marker position={position} icon={customIcon}>
            <Circle
                center={position}
                pathOptions={{ fillColor: "red" }}
                radius={100}
                stroke={false}
              /> 
              <Popup>
                Latitude: {position[0]}
                <br />
                Longitude: {position[1]}
              </Popup>
            </Marker>
          </Circle>
        )}
        <ClickHandler setPosition={setPosition} />
      </MapContainer>
    </Box>
  );
};

export default ProjectMap;
