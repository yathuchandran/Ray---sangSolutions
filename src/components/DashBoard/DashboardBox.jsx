import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { MdDevices, MdCastConnected } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { RiBarChart2Fill } from "react-icons/ri";
import { getBoxData } from "../../api/dashboardApi";
import { Stack } from "@mui/material";
import Loader from "../Loader/Loader";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const iconMap = {
  ActiveProject: <RiBarChart2Fill style={{ fontSize: "4rem", color: "#148a9d" }} />,
  NoOfDevice: <MdDevices style={{ fontSize: "4rem", color: "#228e3b" }} />,
  NoOfEmployees: <HiUsers style={{ fontSize: "4rem", color: "#d9a406" }} />,
  HseOpen: <MdCastConnected style={{ fontSize: "4rem", color: "#bb2d3b" }} />,
  HseClose: <RiBarChart2Fill style={{ fontSize: "4rem", color: "#0a6ed9" }} />,
};

const backgroundColors = {
  ActiveProject: "#189fb5",
  NoOfDevice: "#27a844",
  NoOfEmployees: "#fec007",
  HseOpen: "#dc3546",
  HseClose: "#1385ff",
};

const DashboardBoxItem = ({ dataKey, dataValue, label }) => {
  return (
    <Grid item xl={2.4} lg={2.4} md={4} sm={6} xs={12}>
      <div className="flex-1 mr-1 ml-1 rounded" style={{ background: backgroundColors[dataKey], height: "auto" }}>
        <div className="flex-auto p-4">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} padding={1} justifyContent="space-between">
            <Box>
              <h1 className="font-bold text-4xl text-white pb-2">
                {dataValue}
              </h1>
              <p style={{ fontWeight: "bolder" }} className="mb-0 font-sans font-bold leading-normal text-md text-white">
                {label}
              </p>
            </Box>
            <Box>
              {iconMap[dataKey]}
            </Box>
          </Stack>
        </div>
      </div>
    </Grid>
  );
};

export default function DashboardBox() {
  const [dashboardData, setDashboardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        handleOpen();
        const response = await getBoxData(); // Call the API function
        if (response?.Status === "Success") {
          const parsedData = JSON.parse(response?.ResultData);
          setDashboardData(parsedData);
        }
        handleClose();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (!dashboardData) {
    return <Loader open={open} handleClose={handleClose} />;
  }

  return (
    <Box sx={{ flexGrow: 1, margin: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        <DashboardBoxItem dataKey="ActiveProject" dataValue={dashboardData?.Table[0]?.ActiveProject} label="Active Project" />
        <DashboardBoxItem dataKey="NoOfDevice" dataValue={dashboardData?.Table1[0]?.NoOfDevice} label="Active Device" />
        <DashboardBoxItem dataKey="NoOfEmployees" dataValue={dashboardData?.Table2[0]?.NoOfEmployees} label="Total Employees" />
        <DashboardBoxItem dataKey="HseOpen" dataValue={dashboardData?.Table3[0]?.HseOpen} label="HSE Open" />
        <DashboardBoxItem dataKey="HseClose" dataValue={dashboardData?.Table4[0]?.HseClose} label="HSE Close Out" />
      </Grid>
    </Box>
  );
}
