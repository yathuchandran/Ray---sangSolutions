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
import { buttonColors, secondaryColorTheme } from "../../../../src/config";
import AutoComplete2 from "../AutoComplete/AutoComplete2";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { Details } from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  AttendanceSummary,
  AttendanceSummary_Web,
  DailyAbsenceReport,
  DeleteAttendance,
  getSupervisor_attendance,
} from "../../../api/apiHelper";

import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";

import Header from "../../../components/Header/Header";
import EnhancedTableLog from "../Tables/AttendanceReportTable";
import { exportToExcel } from "../ExportToExcel";
import { getActionBasedOnuser } from "../../../api/settingsApi";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `${secondaryColorTheme}`, // Set text color
  backgroundColor: `${buttonColors}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

function DailyAbsenteesReport() {
  const getInitialFormData = () => {
    const initialToDate = new Date();
    const initialFromDate = new Date();
    // initialFromDate.setDate(initialToDate.getDate() - 30);
    //initialFromDate.setDate(1);

    return {
      FromDate: initialFromDate.toISOString().split("T")[0],
      ToDate: initialToDate.toISOString().split("T")[0],
      sEmp: "",
      iEmployee: 0,
      iType: 0,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [displayLength, setdisplayLength] = useState(10);
  const [displayStart, setdisplayStart] = useState(0);
  const [sortCol, setsortCol] = useState(0);
  const [sortDir, setsortDir] = useState(0); //asc or desc
  const [searchKey, setsearchKey] = useState("");
  const [data, setdata] = useState([]);
  const [dataLog, setdataLog] = useState([]);
  const [newOpen, setnewOpen] = useState(false); //new modal
  const [open, setOpen] = React.useState(false); //loader
  const [changesTriggered, setchangesTriggered] = useState(false);
  const [selectedDatas, setselectedDatas] = useState([]);
  const [selectediIds, setselectediIds] = useState("");
  const [anchorElDelete, setAnchorElDelete] = useState(null);
  const [editOpen, seteditOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [excelData, setexcelData] = useState([])
  const [excelFromDate, setexcelFromDate] = useState('')
  const [excelToDate, setexcelToDate] = useState('')
  const [exceliEmployee, setexceliEmployee] = useState(0)
  const [exceliType, setexceliType] = useState(0)
  const [actions, setActions] = useState([]);

  

  const buttonStyle2 = {
    textTransform: "none", // Set text transform to none for normal case
    color: ` ${buttonColors}`, // Set text color
    backgroundColor: `${secondaryColorTheme}`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    padding: "6px 10px",
  };


  const iUser = localStorage.getItem("userId")? Number(localStorage.getItem("userId")) : ""
  const location = useLocation();
  const pageTitle = location.state?.attendanceReport;
  
  const prevPageTitleRef = useRef(pageTitle?.iScreenId);


  
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
  const columnOrder = [
    { id: 'EmpId', label: 'EmpId'},
    { id: 'EmpName', label: 'EmpName' },
    { id: 'EmpCode', label: 'EmpCode' },
    { id: 'Date', label: 'Date' },
    { id: 'CheckIn', label: 'Check IN' },
    { id: 'Checkout', label: 'Check OUT' },
    
    
  ];
  const excelHeaders = [
    'EmpId', 'EmpName', 'EmpCode', 'Date', 'CheckIn','Checkout' ];

  const navigate = useNavigate();

  const resetChangesTrigger = () => {
    setchangesTriggered(false);
  };

  const handleDateChange = (field, value) => {
    
      setFormData({
        ...formData,
        [field]: value,
      });
    
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
    // As we want to fetch data only when pageTitle changes,
    // we call the fetchData function directly in this effect.
    fetchData(resetFormData);
  };
  const handleDisplayLengthChange = (newDisplayLength) => {
    setdisplayLength(newDisplayLength);
  };

  const handleDisplayStartChange = (newDisplayStart) => {
    setdisplayStart(newDisplayStart);
  };

  const handleSortChange = (newSortCol, newSortDir) => {
    setsortCol(newSortCol);
    setsortDir(newSortDir);
  };

  const handleSearchKeyChange = (newSearchKey) => {
    setsearchKey(newSearchKey);
  };

  const handleSearch = async () => {
   
    const fromDate = new Date(formData.FromDate);
    const toDate = new Date(formData.ToDate);
    const timeDiff = toDate.getTime() - fromDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to the last moment of today

  // Check if dates are in the future
  if (fromDate > today || toDate > today) {
    Swal.fire({
      title: "Error!",
      text: "Dates cannot be in the future",
      icon: "error",
      confirmButtonText: "OK",
    });
    return; // Stop execution if the date is in the future
  }

    if (!formData.FromDate || !formData.ToDate) {
      Swal.fire({
        title: "Error!",
        text: "Please Enter From Date & To Date",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }
    // Check if ToDate is before FromDate
    if (dayDiff < 0) {
      Swal.fire({
        title: "Error!",
        text: "To Date should be greater than or equal to From Date",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }

    // Check if the date range exceeds 31 days
    // if (dayDiff > 30) {
    //   Swal.fire({
    //     title: "Error!",
    //     text: "The date range should not exceed 31 days",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    //   return; // Stop execution if the date range is invalid
    // }
    try {
      handleOpen();
      const FromDate = formData.FromDate;
      const ToDate = formData.ToDate;
      const iEmployee = formData.iEmployee;
      const iType = formData.iType;
      setexcelFromDate(formData.FromDate)//forExcel
      setexcelToDate(formData.ToDate)//forExcel
      setexceliEmployee(iEmployee)
      setexceliType(iType)

      const response = await DailyAbsenceReport({
       
        FromDate,
        ToDate,
        iEmployee,
        iType,
      
      });
      const resultTable = JSON.parse(response.ResultData).Table;
      const updatedData = resultTable.map(({ ...rest }) => rest);
      setdataLog(updatedData);

      setchangesTriggered(true);
      handleClose();
    } catch (error) {
      console.log(error);
      setchangesTriggered(true);
      handleClose();
    }
  };

  useEffect(() => {
    if (!pageTitle) {
      navigate("/home");
    }
  }, [pageTitle, navigate]);

  useEffect(() => {
    // Check if pageTitle has changed
    if (pageTitle && prevPageTitleRef.current !== pageTitle) {
      prevPageTitleRef.current = pageTitle; // Update the ref to the current title

      // Reset formData
      const resetFormData = getInitialFormData();
      setFormData(resetFormData);
      setdisplayLength(10);
      setdisplayStart(0);
      setsearchKey("");
      setchangesTriggered(true);

      // As we want to fetch data only when pageTitle changes,
      // we call the fetchData function directly in this effect.
      fetchData(resetFormData);
    }
  }, [pageTitle]);

  const fetchData = async (formDataToUse) => {
   
    // handleOpen(); // Show loader
    try {
      const FromDate = formDataToUse.FromDate;
      const ToDate = formDataToUse.ToDate;
      const iEmployee = formDataToUse.iEmployee;
      const iType = formDataToUse.iType;
      setexcelFromDate(formDataToUse.FromDate)//forExcel
      setexcelToDate(formDataToUse.ToDate)//forExcel
      setexceliEmployee(iEmployee)
      setexceliType(iType)
      const response = await DailyAbsenceReport({
       
        FromDate,
        ToDate,
        iEmployee,
        iType,
       
      });
     
      const resultTable = JSON.parse(response.ResultData).Table;
      const updatedData = resultTable.map(({ ...rest }) => rest);
      
      // Set the state with the updated data
      setdataLog(updatedData);
      // handleClose(); // Hide loader
    } catch (error) {
      console.error(error);
      // handleClose(); // Hide loader
    }
  };

  
  
  const handleExcelExport = async () => {
    try {
      
      let updatedData = excelData;
      if(formData.FromDate != excelFromDate || formData.ToDate != excelToDate || formData.iEmployee != exceliEmployee || formData.iType != exceliType){
        const FromDate = formData.FromDate;
        const ToDate = formData.ToDate;
        const iEmployee = formData.iEmployee;
        const iType = formData.iType;
        const response = await DailyAbsenceReport({
       
          FromDate,
          ToDate,
          iEmployee,
          iType,
         
        });
        const resultTable = JSON.parse(response.ResultData).Table;
        updatedData = resultTable.map(({ ...rest }) => rest);
      }
      const report_name = `${pageTitle.sName}`
      handleOpen(); // Assuming you use this state to show some loading indicator
      await exportToExcel({ReportName:report_name,filteredRows:updatedData, formData:formData,headers:excelHeaders});
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
            {renderButton(7, "Excel", handleExcelExport, <PrintIcon />, dataLog.length === 0)}
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
                    <MDBInput
                      required
                      id={`form3Example`}
                      type="date"
                      size="small"
                      label="From Date"
                      value={formData.FromDate}
                      onChange={(e) =>
                        handleDateChange("FromDate", e.target.value)
                      }
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      onClick={(e) => e.target.showPicker?.()} 
                      onFocus={(e) => e.target.showPicker?.()} 
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      required
                      id={`form3Example`}
                      type="date"
                      size="small"
                      label="To Date"
                      value={formData.ToDate}
                      onChange={(e) =>
                        handleDateChange("ToDate", e.target.value)
                      }
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      onClick={(e) => e.target.showPicker?.()} 
                      onFocus={(e) => e.target.showPicker?.()} 
                    />
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
                  <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    value={formData.iType}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, iType: e.target.value })}
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
                      },
                    }}
                  >
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={1}>Only CheckIN</MenuItem>
                    <MenuItem value={2}>Only CheckOUT</MenuItem>
                    <MenuItem value={3}>Absentees</MenuItem>
                  </Select>
                </FormControl>


                  </div>
                </MDBCol>

                <MDBCol lg="12" md="12" sm="12" xs="12">
                  <div
                    className="mb-1 gap-2"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      onClick={handleSearch}
                      variant="contained"
                      startIcon={<SearchIcon />}
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
                      Search
                    </Button>
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

         

          <MDBCard
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              zIndex: 1,
              marginTop: 20,
            }}
          >
            <Loader open={open} handleClose={handleClose} />
            <EnhancedTableLog
              key={pageTitle.iScreenId}
              rows={dataLog}
              //onExportData={handleExportData}
              onDisplayLengthChange={handleDisplayLengthChange}
              onDisplayStartChange={handleDisplayStartChange}
              onSortChange={handleSortChange}
              onSearchKeyChange={handleSearchKeyChange}
              pageTitle={pageTitle.iScreenId}
              changesTriggered={changesTriggered}
              setchangesTriggered={resetChangesTrigger}
              setexcelData={setexcelData}
              columnOrder={columnOrder}
            />
          </MDBCard>
        </Box>
      </Box>
    </>
  ) : null;
}

export default DailyAbsenteesReport;
