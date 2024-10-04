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
import SaveIcon from "@mui/icons-material/Save";

import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { Details } from "@mui/icons-material";
import Swal from "sweetalert2";

import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Header from "../../components/Header/Header";
import AutoComplete2 from "./AutoComplete2";
import EnhancedTable from "./BestEmployeeTable";
import { BestEmployeeGetCompany, BestEmployeeSummary, DeleteBestEmployee, PostBestEmployee } from "../../api/apiHelper";
import Loader from "../../components/Loader/Loader";
import { buttonColors, secondaryColorTheme } from "../../config";

import { getActionBasedOnuser } from "../../api/settingsApi";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `${secondaryColorTheme}`, // Set text color
  backgroundColor: `${buttonColors}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

function BestEmployee() {
  const currentYear = new Date().getFullYear(); // Get the current year
  const currentMonth = new Date().getMonth() + 1; // Get the current month (getMonth() returns 0-11)
  const years = Array.from({ length: currentYear - 2019 }, (v, k) => currentYear - k);
  const getInitialFormData = () => {
    const initialToDate = new Date();
    const initialFromDate = new Date();
    // initialFromDate.setDate(initialToDate.getDate() - 30);
    initialFromDate.setDate(1);

    return {
      Month:currentMonth,
      year:currentYear,
      sEmployee: "",
      iEmployee: 0,
      M_Y_Type:0,
      Category:0,
      iId:0,
      iCompany:0
     
    };
  };

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [formData, setFormData] = useState(getInitialFormData);
  const [displayLength, setdisplayLength] = useState(10);
  const [displayStart, setdisplayStart] = useState(0);
  const [sortCol, setsortCol] = useState(0);
  const [sortDir, setsortDir] = useState(0); //asc or desc
  const [searchKey, setsearchKey] = useState("");
  const [data, setdata] = useState([]);
  const [newOpen, setnewOpen] = useState(false); //new modal
  const [open, setOpen] = React.useState(false); //loader
  const [changesTriggered, setchangesTriggered] = useState(false);
  const [selectedDatas, setselectedDatas] = useState([]);
  const [selectediIds, setselectediIds] = useState("");
  const [anchorElDelete, setAnchorElDelete] = useState(null);
  const [editOpen, seteditOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [companyList, setcompanyList] = useState([])
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
  const pageTitle = location.state

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
  

  useEffect(() => {
    const fetchCompany = async()=>{

      try {
      
        const response = await BestEmployeeGetCompany()
        if(response?.ResultData?.length>0){
          const data = JSON.parse(response.ResultData)
          setcompanyList(data)
         
        }
        
  
      } catch (error) {
        
      }

    }
    

    fetchCompany()
   
  }, [])
  
  
  const handleOpenAlert = () => {
    setWarning(true);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
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
    setdisplayLength(10);
    setdisplayStart(0);
    setsearchKey("");
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

  const handleSelectedRowsChange = (selectedRowsData) => {
    setselectedDatas(selectedRowsData);
  };
  const handleRowDoubleClick = (row) => {
    const hasEditAccess = actions.some(action => action.iActionId === 3)
    if (row === null || !hasEditAccess) {
      return null
    } else {
     
      const newData ={
       ...formData,
       Month:selectedDatas[0].iMonth,
       year:selectedDatas[0].iYear,
       sEmployee: selectedDatas[0].sEmployee,
       iEmployee:selectedDatas[0].iEmployee,
       M_Y_Type:selectedDatas[0].iM_Y_Type,
       Category:selectedDatas[0].iCategory,
       iId:selectedDatas[0].iId,
       iCompany:selectedDatas[0].CompanyId

      }
      setFormData(newData)
     
    
   }
  };
  const handleSearchKeyChange = (newSearchKey) => {
    setsearchKey(newSearchKey);
  };
  const handleNewClick = () => {
    handleClear()
  };
  const handleEdit = () => {
   
    if (selectedDatas.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Select Row To Edit",
        icon: "error",
        confirmButtonText: "OK",
      });
    } 
    else if (selectedDatas.length > 1) {
      Swal.fire({
        title: "Error!",
        text: "Only One Entry Can Be Edited",
        icon: "error",
        confirmButtonText: "OK",
      });
    }else {
       
       const newData ={
        ...formData,
        Month:selectedDatas[0].iMonth,
        year:selectedDatas[0].iYear,
        sEmployee: selectedDatas[0].sEmployee,
        iEmployee:selectedDatas[0].iEmployee,
        M_Y_Type:selectedDatas[0].iM_Y_Type,
        Category:selectedDatas[0].iCategory,
        iId:selectedDatas[0].iId,
        iCompany:selectedDatas[0].CompanyId

       }
       setFormData(newData)
      
     
    }
  };
  const handlePageUpdate = async ()=>{
    const resetFormData = getInitialFormData();
    const retainedFormData ={
      ...resetFormData,
      Month:formData.Month,
      year:formData.year,
    }
    setFormData(retainedFormData);
    setdisplayLength(10);
    setdisplayStart(0);
    setsearchKey("");
    setchangesTriggered(true);
   
    fetchData(retainedFormData);
  }
  
  const handleDeleteClick = (event) => {
    
    const iIds = selectedDatas.map((row) => [
      row.iId,
      
    ]);
    setselectediIds(iIds);
    if (iIds.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Select Row To Delete",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      setAnchorElDelete(event.currentTarget);
    }
  }
  const handleDeleteClose = () => {
    setAnchorElDelete(null);
  };
  const handleDelete = async () => {
    const stringWithComma = selectediIds.join(",");
    
    // if(!iUser){
    //   navigate("/")
    // }
    
    const iIds = stringWithComma;
  
    
   
    try {
     

      const response = await DeleteBestEmployee({iIds,iUser});
      
      if (response?.Status === "Success") {
        Swal.fire({
          title: "Deleted",
          text: response.MessageDescription,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handlePageUpdate()
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          confirmButtonColor: "#3085d6",
        });
      }
      // setselectedDatas([]);
      // setselectediIds([]);
      // setchangesTriggered(true);
      setAnchorElDelete(null);
    } catch (error) {
      console.log(error);
      // setchangesTriggered(true);
      setAnchorElDelete(null);
    }
  };
  const handleSearch = async () => {
   
   

    try {
      handleOpen();
      const Month = formData.Month;
      const year = formData.year;
      const iEmployee = formData.iEmployee;
      const M_Y_Type = formData.M_Y_Type;
      const Category = formData.Category
      const iCompany = formData.iCompany
     

      const response = await BestEmployeeSummary({
        displayLength,
        displayStart,
        Month,
        year,
        iEmployee,
        searchKey,
        M_Y_Type,
        Category,
        iCompany
       
      });
  
      const resultTable = response
      const updatedData = resultTable.map(({ ...rest }) => rest);

      setdata(updatedData);
    
      setchangesTriggered(true);
      handleClose();
    } catch (error) {
      console.log(error);
      setchangesTriggered(true);
      handleClose();
    }
  };
  
  const handleSave = async () =>{

    if (!isOnline) {
      // Swal.fire({
      //   title: "Error!",
      //   text: "No Internet Connection",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      //   confirmButtonColor: secondaryColorTheme,
      // });
      handleOpenAlert();
      setMessage(
        `No Internet Connection`
      );
      return; // Return early if offline
    }
    if (formData.M_Y_Type===0) {
      Swal.fire({
        title: "Error!",
        text: "Invalid Type",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      // handleOpenAlert();
      // setMessage(
      //   `Project is required`
      // );
      return;
    }
    if (formData.Category===0) {
      Swal.fire({
        title: "Error!",
        text: "Invalid Category",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      // handleOpenAlert();
      // setMessage(
      //   `Project is required`
      // );
      return;
    }
    if (formData.iEmployee===0) {
      Swal.fire({
        title: "Error!",
        text: "Employee/Supervisor is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      // handleOpenAlert();
      // setMessage(
      //   `Project is required`
      // );
      return;
    }
    if (formData.iCompany===0) {
      Swal.fire({
        title: "Error!",
        text: "Company is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      // handleOpenAlert();
      // setMessage(
      //   `Project is required`
      // );
      return;
    }
    if (!iUser) {
     
      navigate("/")
    }
    try {
      const updatedFormData = {
        iId:formData.iId,
        iMonth:formData.Month,
        iYear:formData.year,
        iEmployee:formData.iEmployee,
        iM_Y_Type:formData.M_Y_Type,
        iCategory:formData.Category,
        iUser:iUser,
        iCompany:formData.iCompany


       };
      const response = await PostBestEmployee(updatedFormData);
      
      if (response.MessageDescription === "Inserted successfully") {
        Swal.fire({
          title: "Saved",
          text: "Inserted successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handlePageUpdate()

        });
      } else if (response.MessageDescription === "Updated successfully") {
        Swal.fire({
          title: "Updated",
          text: "Updated successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handlePageUpdate()
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.MessageDescription,
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      //setchangesTriggered(true)
    } catch (error) {
      console.log(error);
      //setchangesTriggered(true)
    }
    
  }

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
        const Month = formDataToUse.Month;
        const year = formDataToUse.year;
        const iEmployee = formDataToUse.iEmployee;
        const M_Y_Type = formDataToUse.M_Y_Type;
        const Category = formDataToUse.Category
        const iCompany = formDataToUse.iCompany
        const response = await BestEmployeeSummary({
          displayLength,
          displayStart,
          Month,
          year,
          iEmployee,
          searchKey,
          M_Y_Type,
          Category,
          iCompany
         
      
      });
     
      const resultTable = response;
      const updatedData = resultTable.map(({ ...rest }) => rest);
     
      // Set the state with the updated data
      setdata(updatedData);
      // handleClose(); // Hide loader
    } catch (error) {
      console.error(error);
      // handleClose(); // Hide loader
    }
  };

  

  
  
  useEffect(() => {
    
    
      // Only fetch data if pageTitle hasn't changed, implying searchKey triggered the update
      fetchData(formData);
    
  }, [displayLength,
      displayStart,
      sortCol,
      sortDir,
      searchKey,
     ]);
  //network errror
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
    };

    const goOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  
  useEffect(() => {
   if(formData.M_Y_Type==2)
   {
    setFormData({
      ...formData,
      Month:0
    })
   }
  }, [formData.M_Y_Type])
  
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
                  onClick={handleNewClick}
                  variant="contained"
                  startIcon={<AddIcon />}
                  style={buttonStyle}
                  sx={{
                    ...buttonStyle,
                    fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                    padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                  }}
                >
                  New
                </Button>
                <Button
                  onClick={handleEdit}
                  variant="contained"
                  startIcon={<EditIcon />}
                  style={buttonStyle}
                  sx={{
                    ...buttonStyle,
                    fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                    padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDeleteClick}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  style={buttonStyle}
                  sx={{
                    ...buttonStyle,
                    fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                    padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                  }}
                >
                  Delete
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
           {renderButton(2, "New", handleNewClick, <AddIcon />)}
      {renderButton(3, "Edit", handleEdit, <EditIcon />, selectedDatas.length !== 1)}
      {renderButton(4, "Delete", handleDeleteClick, <DeleteIcon />, selectedDatas.length === 0)}
      {/* {renderButton(7, "Excel", handleExcel, <PrintIcon />, selectedDatas.length === 0)} */}
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
                    }}>Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="Typeselect"
                    value={formData.M_Y_Type}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, M_Y_Type: e.target.value })}
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
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={1}>Monthly</MenuItem>
                    <MenuItem value={2}>Yearly</MenuItem>
                    
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
                    }}>Month</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="monthSelect"
                    disabled={formData.M_Y_Type==2}
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
                    <MenuItem value={0}>All</MenuItem>
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
                    }}>Category</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="Categoryselect"
                    value={formData.Category}
                    label="Category"
                    onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
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
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={1}>Best Team Leader</MenuItem>
                    <MenuItem value={2}>Best Stop Card</MenuItem>
                    <MenuItem value={3}>Best Near Miss</MenuItem>
                    <MenuItem value={4}>Driver</MenuItem>
                    
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
                      formDataName={"sEmployee"}
                      formDataiId={"iEmployee"}
                    />
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
                    }}>Company</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="CompanySelect"
                    value={formData.iCompany}
                    label="Company"
                    onChange={(e) => setFormData({ ...formData, iCompany: e.target.value })}
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
                            scrollbarWidth:"thin"
                          },
                      },
                      getContentAnchorEl: null,
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center",
                        },
                    }}
                  >
                    {companyList && companyList.map((item) => (
          <MenuItem key={item.iId} value={item.iId}>
            {item.sName}
          </MenuItem>
        ))}
                    
                    
                    
                  </Select>
                  </FormControl>
                  </div>
                </MDBCol>
               
                <MDBCol lg="12" md="12" sm="12" xs="12">
                  <div
                    className="mb-1 gap-2"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {/* <Button
                    onClick={handleSave}
                    variant="contained"
                    startIcon={<SaveIcon />}
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
                    style={buttonStyle}
                  >
                    Save
                  </Button> */}
                  {renderButton(8, "Save", handleSave, <SaveIcon />)}
                    <Button
                      onClick={handleSearch}
                      variant="contained"
                      startIcon={<SearchIcon />}
                      style={buttonStyle}
                      
                    >
                      Search
                    </Button>
                    <Button
                      onClick={handleClear}
                      variant="contained"
                      startIcon={<ClearAllIcon />}
                      style={buttonStyle}
                     
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
            
            <EnhancedTable
              key={pageTitle.iScreenId}
              rows={data}
              //onExportData={handleExportData}
              onDisplayLengthChange={handleDisplayLengthChange}
              onDisplayStartChange={handleDisplayStartChange}
              onSortChange={handleSortChange}
              onSearchKeyChange={handleSearchKeyChange}
              pageTitle={pageTitle.iScreenId}
              changesTriggered={changesTriggered}
              setchangesTriggered={resetChangesTrigger}
              onSelectedRowsChange={handleSelectedRowsChange}
              onRowDoubleClick={handleRowDoubleClick}
            />
          </MDBCard>
        </Box>
        <Popover
          open={Boolean(anchorElDelete)}
          anchorEl={anchorElDelete}
          onClose={handleDeleteClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {selectediIds.length} row ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDelete}
              style={{
                textTransform: "none",
                backgroundColor: secondaryColorTheme,
                color: "white",
              }}
            >
              Delete
            </Button>
            <Button
              onClick={handleDeleteClose}
              style={{
                textTransform: "none",
                backgroundColor: secondaryColorTheme,
                color: "white",
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Popover>
        <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
      </Box>
    </>
  ) : null;
}

export default BestEmployee;
