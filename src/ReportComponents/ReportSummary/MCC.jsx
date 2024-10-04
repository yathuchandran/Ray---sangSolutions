import React, { useEffect, useState } from 'react'
import Header from "../../components/Header/Header";
import { Box, Paper } from '@mui/material';
import { buttonColors, secondaryColorTheme } from "../../config";
import Stack from "@mui/material/Stack";
import { Button, ButtonGroup, TextField } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import AutoComplete from "../AutoComplete/AutocompleteGetprjct";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import exportToExcel from './ExportTOexcel'
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Swal from "sweetalert2";

import {
  Autocomplete,
} from "@mui/material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,

} from "@mui/material";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,

} from "mdb-react-ui-kit";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import { CrystalPrint, GetAllEmployee, GetProject, MCCReactReport } from '../../api/api';
import ImageModal from './ImgViewModals';
import Loader from '../../components/Loader/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import SiteIncharge from '../AutoComplete/SiteInCharge';
import ImageIcon from '@mui/icons-material/Image';
import { getActionBasedOnuser } from '../../api/settingsApi';



function MCC({ data, name }) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedCurrentDate = `${year}-${month}-${day}`;

  const tenDaysAgoDate = new Date();
  tenDaysAgoDate.setDate(tenDaysAgoDate.getDate() - 7);
  const tenDaysAgoYear = tenDaysAgoDate.getFullYear();
  const tenDaysAgoMonth = String(tenDaysAgoDate.getMonth() + 1).padStart(2, "0");
  const tenDaysAgoDay = String(tenDaysAgoDate.getDate()).padStart(2, "0");
  const formattedTenDaysAgoDate = `${tenDaysAgoYear}-${tenDaysAgoMonth}-${tenDaysAgoDay}`;


  const [ProjectsList, setProjectLists] = useState([])
  const [FromDate, setFromDate] = useState(formattedTenDaysAgoDate)
  const [TODate, setTodate] = useState(formattedCurrentDate)
  const [Project, setProject] = useState(0)
  const [Employee, setEmployee] = useState('')
  const [images, setImages] = useState([])
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [iProjects, setIproject] = useState(0)
  const [intiate, setinitiate] = useState(0)
  const [visibleHeaders, setVisibleHeaders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredRows, setFilteredRows] = React.useState([]);

  const [displayLength, setdisplayLength] = useState(10);
  const [displayStart, setdisplayStart] = useState(0);


  const [excelData, setExcelData] = useState('')
  const [actions, setActions] = React.useState([]);

  const buttonStyle = {
    textTransform: "none", // Set text transform to none for normal case
    color: `${secondaryColorTheme}`, // Set text color
    backgroundColor: `${buttonColors}`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    padding: "6px 10px",
  };

  const buttonStyle2 = {
    textTransform: "none", // Set text transform to none for normal case
    color: ` ${buttonColors}`, // Set text color
    backgroundColor: `${secondaryColorTheme}`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    padding: "6px 10px",
  };


  const location = useLocation();
  const details = location.state;
  const navigates = useNavigate()
  const PageName = details.sName
  const iUser = localStorage.getItem("userId")
  ? Number(localStorage.getItem("userId"))
  : "";

  React.useEffect(() => {
    const fetchData2 = async () => {
      const response = await getActionBasedOnuser({
        iScreenId: details?.iScreenId,
        uId: iUser,
      });
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setActions(myObject);
      }
    };
    fetchData2();
  }, [details]);

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



  const handleDisplayStartChange = (newDisplayStart) => {
    setdisplayStart(newDisplayStart);
  };
  const handleDisplayLengthChange = (newDisplayLength) => {
    setdisplayLength(newDisplayLength);
  };


  const handleExportToExcel = async () => {
    try {
      const res = await MCCReactReport({
        DisplayLength: 0,
        DisplayStart: 0,
        FromDate: FromDate,
        ToDate: TODate,
        iProject: iProjects,
        iSiteincharge: intiate,
        Search: "",
      })

      if (res.length > 0) {
        exportToExcel(res, visibleHeaders, PageName, FromDate, TODate); // Pass your filtered/visibleRows data here
      }

    } catch (error) {
      console.log(error);
    }

  };




  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenImages = (images) => {
    if (images && images.sImage && images.sPath) {
      const Image = images.sImage;
      const Path = images.sPath;
      const imageArray = images.sImage.split(";");
      const imageUrlArray = imageArray.map(image => Path + image);

      setImages(imageUrlArray);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  

  //API DATA CALLING USEEFECT----------------------------------------------
  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await GetProject({
          iStatus: 1,
          sSearch: ""
        })
        const data = JSON.parse(res?.ResultData)
        setProject(data.sName)
      } catch (error) {
        console.log(error);
      }
    }
    getProjects()

    const GetAllEmployees = async () => {
      try {
        const res = await GetAllEmployee({
          sSearch: ""
        })
        const data = JSON.parse(res?.ResultData)
        setEmployee(data)
      } catch (error) {
        console.log(error);
      }
    }
    GetAllEmployees()
  }, [])

  const getInitialFormData = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedCurrentDate = `${year}-${month}-${day}`;

    const tenDaysAgoDate = new Date();
    tenDaysAgoDate.setDate(tenDaysAgoDate.getDate() - 7);
    const tenDaysAgoYear = tenDaysAgoDate.getFullYear();
    const tenDaysAgoMonth = String(tenDaysAgoDate.getMonth() + 1).padStart(2, "0");
    const tenDaysAgoDay = String(tenDaysAgoDate.getDate()).padStart(2, "0");
    const formattedTenDaysAgoDate = `${tenDaysAgoYear}-${tenDaysAgoMonth}-${tenDaysAgoDay}`;
    setFromDate(formattedTenDaysAgoDate);
    setTodate(formattedCurrentDate);
    return {
      DisplayLength: displayLength,
      DisplayStart: displayStart,
      FromDate: formattedTenDaysAgoDate,
      ToDate: formattedCurrentDate,
      iProject: 0,
      iSiteincharge: 0,
      Search: "",

    }
  };


  useEffect(() => {
    handleOpen()
    const newFormdata = {
      DisplayLength: displayLength,
      DisplayStart: displayStart,
      FromDate: FromDate,
      ToDate: TODate,
      iProject: iProjects,
      iSiteincharge: intiate,
      Search: searchQuery,
    }
    handleClose()
    fetchData(newFormdata)
  }, [displayLength, displayStart,searchQuery])

  const handleClear = () => {
    const resetFormData = getInitialFormData();
    fetchData(resetFormData)
    setProject(0)
    setIproject(0)
    setEmployee(0)
    setinitiate(0)
  };

  // initialData SETTING FUNCTION-------------------------------------------
  const fetchData = async (initialData) => {
    handleOpen()
    try {
      const res = await MCCReactReport({
        DisplayLength: displayLength,
        DisplayStart: displayStart,
        FromDate: initialData.FromDate,
        ToDate: initialData.ToDate,
        iProject: initialData.iProject,
        iSiteincharge: initialData.iSiteincharge,
        Search: ""
      });
      setProjectLists(res);
      handleClose()
    } catch (error) {
      console.log(error);
      handleClose()
    }
  }

  //FORM SUBMIT HANDLE SAVE FUNCTION-------------------------------
  const handleSave = async (e) => {
    e.preventDefault();
    const fromDate = new Date(FromDate);
    const toDate = new Date(TODate);
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

    if (!FromDate || !TODate) {
      Swal.fire({
        title: "Error!",
        text: "Please Enter From Date & To Date",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }
    if (dayDiff < 0) {
      Swal.fire({
        title: "Error!",
        text: "To Date should be greater than or equal to From Date",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }


    handleOpen()
    try {
      const res = await MCCReactReport({
        DisplayLength: displayLength,
        DisplayStart: displayStart,
        FromDate: FromDate,
        ToDate: TODate,
        iProject: iProjects,
        iSiteincharge: intiate,
        Search: searchQuery,
      });
      setProjectLists(res);
      handleClose()
    } catch (error) {
      console.log(error);
      handleClose()
    }
  };

  //FORM INPUT FIELD DATA SETTING FUNCTIONS-------------------------------------
  const hndlPrjctChange = async (obj) => {
    if (obj) {
      setIproject(obj.iId)
      setProject(obj)
    } else {
      setProject(0)
      setIproject(0)

    }
  }
  const handleInitiate = async (obj) => {
    if (obj) {
      setinitiate(obj.iId)
      setEmployee(obj)
    } else {
      setEmployee(0)
      setinitiate(0)
    }
  }

  //PAGINATION AND SEARCH FUNCTION-------------------------------------------------
  const handleChangePage = (newPage) => {
    setPage(newPage);
    const newDisplayStart = newPage * rowsPerPage;
    handleDisplayStartChange(newDisplayStart);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    const newDisplayStart = 0;
    handleDisplayStartChange(newDisplayStart);
    handleDisplayLengthChange(newRowsPerPage);
  };

  //SEARCH FUNCTIONSS---------------------------------------------------------------------
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  useEffect(() => {
    if (searchQuery) {
      const filteredRows = ProjectsList.filter((row) =>
        Object.values(row).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          if (typeof value === "number") {
            return value.toString().includes(searchQuery.toLowerCase());
          }
          return false; // Ignore other types
        })
      );
      setFilteredRows(filteredRows);
    } else {
      setFilteredRows(ProjectsList);
    }
  }, [searchQuery, ProjectsList, page, rowsPerPage]);

  const clickClose = () => {
    navigates("/home");
  }
  //PDF FUNCTIONSS------------------------------------------------------------------
  const handleopenpdf = async (iTransId) => {
    const crystalRes = await CrystalPrint({
      iTransId: iTransId,
      iFormtype: 8,
    });
    window.open(crystalRes.ResultData, "_blank")
  }
  return (
    <div>
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
              // paddingBottom:"50px"
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              padding={1}
              justifyContent="space-between"
            >
              <Box >
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
                  {details.sScreen}
                </Typography>
              </Box>
              {/* <Box sx={{ display: 'flex', gap: '9px' }}>
                <Button
                  variant="contained"
                  startIcon={<PrintIcon />}
                  style={buttonStyle}
                  onClick={handleExportToExcel}
                  sx={{
                    ...buttonStyle,
                    fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                    padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                  }}
                >
                  Excel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CloseIcon />}
                  style={buttonStyle}
                  onClick={clickClose}
                  sx={{
                    ...buttonStyle,
                    fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                    padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                  }}
                >
                  Close
                </Button>
              </Box> */}
               <Stack
      direction="row"
      spacing={1}
      padding={1}
      justifyContent="flex-end"
    >
      {/* {details?.iScreenId !== 7 && renderButton(2, "New", handleNewNavigate, <AddIcon />)}
      {renderButton(3, "Edit", handleNavigate, <EditIcon />, selected.length !== 1)}
      {renderButton(4, "Delete", handleDelete, <DeleteIcon />, selected.length === 0)} */}
      {renderButton(7, "Excel", handleExportToExcel, <PrintIcon />, filteredRows.length === 0)}
      <Button
        onClick={() => navigates("/home")}
        variant="contained"
        startIcon={<CloseIcon />}
        style={buttonStyle}
      >
        Close
      </Button>
    </Stack>
            </Stack>


            <form onSubmit={handleSave}>
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
                          value={FromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                          onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                          onFocus={(e) => e.target.showPicker?.()} // Fallback for when the field is focused
    
                          labelStyle={{
                            fontSize: '15px',
                          }}
                        />
                      </div>
                    </MDBCol>
                    <MDBCol lg="3" md="4" sm="6" xs="12">
                      <div className="mb-3">
                        <MDBInput
                          required
                          // id={form3Example}
                          type="date"
                          size="small"
                          label=" To Date"
                          value={TODate}
                          onChange={(e) => setTodate(e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                          onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                          onFocus={(e) => e.target.showPicker?.()} // Fallback for when the field is focused
    
                          labelStyle={{
                            fontSize: '15px',
                          }}
                        />
                      </div>
                    </MDBCol>

                    <MDBCol lg="3" md="4" sm="6" xs="12">
                      <div className="mb-3">
                        <div className="mb-3">
                          <AutoComplete
                            apiName={GetProject}
                            value={Project}
                            onChangeName={hndlPrjctChange}
                          />
                        </div>
                      </div>
                    </MDBCol>
                    <MDBCol lg="3" md="4" sm="6" xs="12">
                      <div className="mb-3">
                        <div className="mb-3">
                          <SiteIncharge
                            apiName={GetAllEmployee}
                            value={Employee}
                            onChangeName={handleInitiate}
                          />
                        </div>
                      </div>
                    </MDBCol>
                    <MDBCol lg="12" md="12" sm="12" xs="12">
                      <div
                        className="mb-1"
                        style={{
                          display: "flex", justifyContent: "flex-end",
                          gap: "9px", // Add gap between buttons
                        }}
                      >
                        <Button type="submit"
                          className="btn btn-primary"
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
                        >Search</Button>

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
            </form>
          </Box>


          <Box sx={{ paddingBottom: "50px" }}>
            <MDBCard
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                zIndex: 1,
                marginTop: 20,
              }}
            >
              {ProjectsList && (
                <Box sx={{ width: "95%", margin: "auto", marginTop: "30px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <FormControl sx={{ m: 1 }}>
                      <InputLabel htmlFor="rows-per-page">Show Entries</InputLabel>
                      <Select
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        label="Rows per page"
                        inputProps={{
                          name: "rows-per-page",
                          id: "rows-per-page",
                        }}
                        sx={{
                          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
                          width: { xs: "80px", sm: "120px", md: "150px" },
                          height: { xs: "25px", sm: "35px", md: "35px" },
                        }}
                      >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="Search"
                      variant="outlined"
                      size="small"
                      value={searchQuery}
                      onChange={handleSearch}
                      sx={{
                        '& input': {
                          padding: '7px 10px', // Adjust padding for input text
                        },
                      }}
                    />
                  </div>
                  <Paper sx={{ width: "100%", mb: 2 }}>

                    <TableContainer sx={{ maxHeight: "30vh", overflow: "scroll" }}>
                      <Table
                        stickyHeader
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                      >
                        <TableHead>
                          {filteredRows && filteredRows.length > 0 ? (
                            <TableRow>
                              {Object.keys(filteredRows[0])
                                .filter((key) => key !== "totalRows" && key !== "sPath" && key !== "Dri_LicenceExpiry" && key !== "sClient" && key !== "sMark_Model" && key !== "sOperatorName" && key !== "sRegistrationNo") // Exclude sPath from the keys
                                .map((key) => (
                                  <TableCell
                                    key={key}
                                    align="left"
                                    sx={{
                                      padding: "4px",
                                      border: " 1px solid #ddd",
                                      fontWeight: "600",
                                      fontSize: "14px",
                                      backgroundColor: secondaryColorTheme,
                                      color: "white",
                                    }}
                                  >
                                    {key === "sImage" ? "Images" :
                                      key === "iTransId" ? "Print" :
                                        key === "CreatedBy" ? "InitiatedBy" :
                                          key}
                                  </TableCell>
                                ))}
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell colSpan={1} sx={{
                                padding: "4px",
                                border: "1px solid #ddd",
                                fontWeight: "600",
                                fontSize: "12px",
                                backgroundColor: secondaryColorTheme,
                                color: "white",
                              }}
                                align="center"
                              >
                                No Data Here
                              </TableCell>
                            </TableRow>
                          )}
                        </TableHead>

                        <TableBody>
                          {filteredRows && filteredRows.length > 0 && filteredRows
                            .map((row, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  sx={{
                                    cursor: "pointer",
                                    marginBottom: "10px"
                                  }}
                                  key={row.iId} // Fix: Use row.id instead of row.iId

                                >
                                  {Object.keys(row)
                                    .filter((key) => key !== "totalRows" && key !== "sPath" && key !== "Dri_LicenceExpiry" && key !== "sClient" && key !== "sMark_Model" && key !== "sOperatorName" && key !== "sRegistrationNo") // Exclude sPath from the keys
                                    .map((key, idx) => (
                                      <TableCell
                                        sx={{
                                          padding: "0px",
                                          paddingLeft: "4px",
                                          border: " 1px solid #ddd",
                                          minWidth: "100px",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                        style={{
                                          // width: ${columnWidths[columnKey]}px,
                                          maxWidth: "300px",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          borderBottom: "0px solid #ddd",
                                          borderLeft: "1px solid #ddd",
                                          borderRight: "1px solid #ddd",
                                          fontSize: "14px",
                                          // textAlign: shouldAlignRight ? "right" : "left",
                                        }}
                                        key={idx}
                                      >
                                        {key === "sImage" ? (
                                          row[key] ? (
                                            <Button sx={{ padding: "0px" }} onClick={() => handleOpenImages(row)}>
                                              <ImageIcon sx={{ padding: "0px" }} />
                                            </Button>
                                          ) : (
                                            <><BrokenImageIcon sx={{ color: secondaryColorTheme, padding: "0px" }} /><span>No image</span></>// Display text if sPhoto is null or empty

                                          )
                                        ) : key === "iTransId" ? (
                                          row[key] ? (
                                            <Button sx={{ padding: "0px" }} onClick={() => handleopenpdf(row[key])} >
                                              <PictureAsPdfIcon sx={{ padding: "0px" }} />
                                            </Button>
                                          ) : (
                                            <><BrokenImageIcon sx={{ color: secondaryColorTheme, padding: "0px" }} /><span>No image</span></>// Display text if sPhoto is null or empty
                                          )
                                        ) : (
                                          row[key]
                                        )}
                                      </TableCell>
                                    ))}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>

                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={ProjectsList.length > 0 ? ProjectsList[0].totalRows : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                      sx={{
                        display: "flex", // Use flexbox for the container
                        justifyContent: "space-between", // Space between the elements
                        alignItems: "center", // Center the elements vertically
                        ".MuiTablePagination-toolbar": {
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%", // Ensure the toolbar takes the full width
                        },
                        ".MuiTablePagination-spacer": {
                          flex: "1 1 100%", // Force the spacer to take up all available space
                        },
                        ".MuiTablePagination-selectLabel": {
                          margin: 0, // Adjust or remove margin as needed
                          display: "none"
                        },
                        ".MuiTablePagination-select": {
                          textAlign: "center", // Center the text inside the select input
                          display: "none"
                        },
                        ".MuiTablePagination-selectIcon": {
                          display: "none" // Adjust the position of the icon as needed
                        },
                        ".MuiTablePagination-displayedRows": {
                          textAlign: "left", // Align the "1-4 of 4" text to the left
                          flexShrink: 0, // Prevent the text from shrinking
                          order: -1, // Place it at the beginning

                        },
                        ".MuiTablePagination-actions": {
                          flexShrink: 0, // Prevent the actions from shrinking
                        },
                        // Add other styles as needed
                      }}
                    />
                  </Paper>
                </Box>
              )}
              <ImageModal open={openModal} handleClose={handleCloseModal} images={images} />
            </MDBCard>
          </Box>
        </Box>
      </>
    </div >
  )
}

const TablePaginationActions = (props) => {
  const { count, page, rowsPerPage, onPageChange } = props;

  // Calculate the last page index
  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  // Generate page numbers: we want to show 2 pages on each side if possible
  const startPage = Math.max(0, page - 2); // Current page - 2, but not less than 0
  const endPage = Math.min(lastPage, page + 2); // Current page + 2, but not more than last page

  // Create an array of page numbers to be shown
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, idx) => startPage + idx
  );

  const handlePageButtonClick = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <div style={{ flexShrink: 0, marginLeft: 20 }}>
      {page > 0 && (
        <IconButton onClick={() => handlePageButtonClick(0)}>
          <FirstPageIcon />
        </IconButton>
      )}
      {pages.map((pageNum) => (
        <IconButton
          sx={{
            width: "30px",
            height: "30px",
            padding: '0px',
            margin: '0px',
            borderRadius: '50%', // Make the background round
            color: 'inherit',
            backgroundColor: pageNum === page ? 'grey' : 'white',
            '&:hover': {
              backgroundColor: pageNum === page ? 'grey' : 'lightgrey', // Change hover color
            },
            '&.Mui-disabled': {
              backgroundColor: 'white',
            }
          }}

          key={pageNum}
          color={pageNum === page ? "primary" : "default"}
          onClick={() => handlePageButtonClick(pageNum)}
          disabled={pageNum > lastPage}
        >
          {pageNum + 1}
        </IconButton>
      ))}
      {page < lastPage && (
        <IconButton onClick={() => handlePageButtonClick(lastPage)}>
          <LastPageIcon />
        </IconButton>
      )}
    </div>
  );
};


export default MCC
