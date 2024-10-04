import React, { useEffect, useRef, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import {
  Autocomplete,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../../../components/Loader/Loader";
import SaveIcon from "@mui/icons-material/Save";
import { buttonColors, secondaryColorTheme } from "../../../config";
import AutoComplete2 from "../AutoComplete/AutoComplete2";

import {
  GenerateExcelReport,
  
} from "../../../api/apiHelper";

import ClearAllIcon from "@mui/icons-material/ClearAll";

import Header from "../../../components/Header/Header";


import { getActionBasedOnuser } from "../../../api/settingsApi";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `${secondaryColorTheme}`, // Set text color
  backgroundColor: `${buttonColors}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};
function MontlyAttendanceProjectWise() {
  const currentYear = new Date().getFullYear(); // Get the current year
  const currentMonth = new Date().getMonth() + 1; // Get the current month (getMonth() returns 0-11)
  const years = Array.from({ length: currentYear - 1980 }, (v, k) => currentYear - k);
  const getInitialFormData = () => {
 

    return {
      Month:currentMonth,
      year:currentYear,
      sEmp: "",
      iEmployee: 0,
      sProj: "",
      iProject: 0,
      iType:3
     
    };
  };
 const iUser = localStorage.getItem("userId")? Number(localStorage.getItem("userId")) : ""
  const [formData, setFormData] = useState(getInitialFormData);


  const [open, setOpen] = React.useState(false); //loader
  const [changesTriggered, setchangesTriggered] = useState(false);
  const [actions, setActions] = useState([]);

  

  const buttonStyle2 = {
    textTransform: "none", // Set text transform to none for normal case
    color: ` ${buttonColors}`, // Set text color
    backgroundColor: `${secondaryColorTheme}`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    padding: "6px 10px",
  };
 


  const location = useLocation();
  const pageTitle = location.state?.attendanceReport;

  React.useEffect(() => {
    const fetchData2 = async () => {
      const response = await getActionBasedOnuser({
        iScreenId: pageTitle?.iScreenId,
        uId: iUser,
      });
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setActions(myObject);
        
      }
    };
    fetchData2();
  }, [pageTitle]);
  const renderButton = (actionId, label, onClick, icon, disabled = false, style = buttonStyle) => {
    return actions.some(action => action.iActionId === actionId) ? (
      <Button
        onClick={onClick}
        variant="contained"
        disabled={disabled}
        startIcon={icon}
        style={disabled ? buttonStyle2 : style}
      >
        {label}
      </Button>
    ) : null;
  };
 
  const navigate = useNavigate();

  const resetChangesTrigger = () => {
    setchangesTriggered(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClear = () => {
    const resetFormData = getInitialFormData();
    setFormData(resetFormData);

    setchangesTriggered(true);
   
  };
 

 

 

  useEffect(() => {
    if (!pageTitle) {
      navigate("/home");
    }
  }, [pageTitle, navigate]);

 
  const formatDateTimeForFilename = () => {
    const now = new Date();
    let day = '' + now.getDate();
    let month = '' + (now.getMonth() + 1);
    const year = now.getFullYear();
    let hours = '' + now.getHours();
    let minutes = '' + now.getMinutes();
    let seconds = '' + now.getSeconds();

    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    return [day, month, year].join('-') + '_' + [hours, minutes, seconds].join('-');
};
 
  const downloadExcelFile = (url) => {
    const dateTimeStringForFilename = formatDateTimeForFilename();
    // Create an anchor element
    const link = document.createElement('a');
    link.href = url;
    // Set the download attribute to the desired file name, if needed
    link.download = `MontlyAttendanceProjectWise_${dateTimeStringForFilename}.xlsx`;
    // Append the anchor to the body (required for Firefox)
    document.body.appendChild(link);
    // Trigger click
    link.click();
    // Clean up and remove the link
    document.body.removeChild(link);
  };
  
  

  
  const handleExcelExport = async () => {
    try {
      
      handleOpen(); // Assuming you use this state to show some loading indicator
      const Month = formData.Month;
        const year = formData.year;
        const iEmployee = formData.iEmployee;
        const iProject = formData.iProject;
        const iType = 2;//for monthlyattendanceprojectwise
        const response = await GenerateExcelReport({
         
          Month,
          year,
          iEmployee,
          iProject,
          iType
         
      
      });
     
      const excelFile = response.ResultData;
      downloadExcelFile(excelFile);
      
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      // Handle error scenario, maybe show a message to the user
    } finally {
      handleClose(); // Hide loading indicator
    }
  };


  return pageTitle ? (
    <>
      <Header />
      <Box
        sx={{
          margin: 0,
          background: `${secondaryColorTheme}`,
          height: "200px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box
          sx={{
            width: "auto",
            paddingLeft: 2,
            paddingRight: 2,
            zIndex: 1,
            paddingBottom:"50px"
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            padding={1}
            justifyContent="space-between"
          >
            <Box>
              <Typography
                style={{
                  color: `${buttonColors}`,
                  margin: 3,
                }}
                sx={{
                  fontSize: {
                    xs: "0.875rem", // smaller font size on extra-small devices
                    sm: "1.25rem", // default h6 font size on small devices and above
                  },
                }}
                variant="h6"
                component="h2"
              >
               {pageTitle.sName}
              </Typography>
            </Box>
            <Stack direction="row"
      spacing={1}
      padding={1}
      justifyContent="flex-end">
              {/* <Button
                onClick={handleExcelExport}
                variant="contained"
                startIcon={<PrintIcon />}
                style={buttonStyle}
                sx={{
                  ...buttonStyle,
                  fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                  padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                }}
              >
                Excel
              </Button>

              <Button
                onClick={() => navigate("/home")}
                variant="contained"
                startIcon={<CloseIcon />}
                style={buttonStyle}
                sx={{
                  ...buttonStyle,
                  fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                  padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                }}
              >
                Close
              </Button> */}
                {/* {renderButton(7, "Excel", handleExcelExport, <PrintIcon />, "true")} */}
                {/* <Button
      onClick={handleExcelExport}
        variant="contained"
        startIcon={<PrintIcon />}
        style={buttonStyle}
      >
       Excel
      </Button> */}
      {renderButton(7, "Excel", handleExcelExport, <PrintIcon />,false)}
      <Button
       onClick={() => navigate("/home")}
        variant="contained"
        startIcon={<CloseIcon />}
        style={buttonStyle}
      >
        Close
      </Button>
      </Stack>
          </Stack>
          <MDBCard
            className="text-center "
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
          >
            <MDBCardBody>
              <MDBRow>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                  <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="type-select-label" sx={{
                    '&.Mui-focused': { // Apply styles when the label is focused
                        backgroundColor: 'white', // Set background color to white
                        padding: '0 4px', // Add some padding to avoid overlapping with the border
                        lineHeight: '1.4375em', // Adjust line height to ensure proper positioning
                    },
                    '&.MuiInputLabel-shrink': { // Ensure the styles apply when the label is shrunk
                        backgroundColor: 'white', // Maintain the background color
                        padding: '0 4px', // Maintain padding
                    }
                    }}>Month</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="monthSelect"
                    value={formData.Month}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, Month: e.target.value })}
                    sx={{ width: "100%", height: "37px", fontSize: "14px", ".MuiSelect-select": { // This targets the selected value area
                      textAlign: 'left',
                      paddingLeft: '12px', // Adjust the padding as needed
                    }, }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          '& .MuiMenuItem-root': {
                            fontSize: '0.875rem', // smaller font size
                            padding: '4px 8px', // reduced padding
                          },
                        },
                        style: {
                            maxHeight: 300, // Set the max height for the dropdown
                          },
                      },
                      getContentAnchorEl: null,
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center",
                        },
                    }}
                  >
                    <MenuItem value={1}>Jan</MenuItem>
                    <MenuItem value={2}>Feb</MenuItem>
                    <MenuItem value={3}>Mar</MenuItem>
                    <MenuItem value={4}>Apr</MenuItem>
                    <MenuItem value={5}>May</MenuItem>
                    <MenuItem value={6}>June</MenuItem>
                    <MenuItem value={7}>July</MenuItem>
                    <MenuItem value={8}>Aug</MenuItem>
                    <MenuItem value={9}>Sep</MenuItem>
                    <MenuItem value={10}>Oct</MenuItem>
                    <MenuItem value={11}>Nov</MenuItem>
                    <MenuItem value={12}>Dec</MenuItem>
                  </Select>
                  </FormControl>
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                  <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="type-select-label" sx={{
                    '&.Mui-focused': { // Apply styles when the label is focused
                        backgroundColor: 'white', // Set background color to white
                        padding: '0 4px', // Add some padding to avoid overlapping with the border
                        lineHeight: '1.4375em', // Adjust line height to ensure proper positioning
                    },
                    '&.MuiInputLabel-shrink': { // Ensure the styles apply when the label is shrunk
                        backgroundColor: 'white', // Maintain the background color
                        padding: '0 4px', // Maintain padding
                    }
                    }}>Year</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="YearSelect"
                    value={formData.year}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    sx={{ width: "100%", height: "37px", fontSize: "14px", ".MuiSelect-select": { // This targets the selected value area
                      textAlign: 'left',
                      paddingLeft: '12px', // Adjust the padding as needed
                    }, }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          '& .MuiMenuItem-root': {
                            fontSize: '0.875rem', // smaller font size
                            padding: '4px 8px', // reduced padding
                          },
                        },
                        style: {
                            maxHeight: 300, // Set the max height for the dropdown
                          },
                      },
                      getContentAnchorEl: null,
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center",
                        },
                    }}
                  >
                    {years.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                    ))}
                    
                  </Select>
                  </FormControl>
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <AutoComplete2
                      formData={formData}
                      setFormData={setFormData}
                      autoId={`Employee`}
                      label={"Employee/Supervisor"}
                      apiKey={"GetAllEmployee?"}
                      formDataName={"sEmp"}
                      formDataiId={"iEmployee"}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <AutoComplete2
                      formData={formData}
                      setFormData={setFormData}
                      autoId={`projects`}
                      label={"Projects"}
                      apiKey={"GetProject?iStatus=3"}
                      formDataName={"sProj"}
                      formDataiId={"iProject"}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <AutoComplete2
                      formData={formData}
                      setFormData={setFormData}
                      autoId={`Layout`}
                      label={"Layout"}
                      apiKey={"GetLayout?iType=6"}
                      formDataName={"sType"}
                      formDataiId={"iType"}
                    />
                  </div>
                </MDBCol>

                <MDBCol lg="12" md="12" sm="12" xs="12">
                  <div
                    className="mb-1 gap-2"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                   
                    <Button
                      onClick={handleClear}
                      variant="contained"
                      startIcon={<ClearAllIcon />}
                      style={buttonStyle}
                      sx={{
                        ...buttonStyle,
                        fontSize: {
                          xs: "0.60rem",
                          sm: "0.75rem",
                          md: "0.875rem",
                        }, // Adjust font size based on screen size
                        padding: {
                          xs: "1px 2px",
                          sm: "3px 6px",
                          md: "6px 12px",
                        }, // Adjust padding based on screen size
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

         

          
            <Loader open={open} handleClose={handleClose} />
            
        </Box>
      </Box>
    </>
  ) : null;
}

export default MontlyAttendanceProjectWise;
