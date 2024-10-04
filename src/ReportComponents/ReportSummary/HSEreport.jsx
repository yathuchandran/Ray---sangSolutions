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
import AutoComplete2 from "../AutoComplete/AutoCmpltInitiateBy";
import AutoComplete3 from "../AutoComplete/ActionByAutocmplt";
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import exportToExcel from './ExportTOexcel'
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ClearAllIcon from "@mui/icons-material/ClearAll";

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
import SearchIcon from '@mui/icons-material/Search';
import { CrystalPrint, GetAllEmployee, GetProject, GetUser, GetcloseStatus, HSEReactReport } from '../../api/api';
import ImageModal from './ImgViewModals';
import Loader from '../../components/Loader/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import IncidentReport from './IncidentReport';
import StopCardReport from './StopCardReport';
import AutocloseStatus from '../AutoComplete/AutocloseStatus';



function HSEreport({ data }) {
  const [ProjectsList, setProjectLists] = useState([])
  const [FromDate, setFromDate] = useState("")
  const [TODate, setTodate] = useState('')
  const [Project, setProject] = useState(0)
  const [Employee, setEmployee] = useState('')
  const [Supervisor, setSupervisor] = useState('')
  const [riskLevel, setRiskLevel] = useState(0);
  const [closeStatus, setCloseStatus] = useState([])
  const [images, setImages] = useState([])
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [iProjects, setIproject] = useState(0)
  const [intiate, setinitiate] = useState(0)
  const [Action, setAction] = useState(0)
  // const [visibleData, setVisibleData] = useState([]);
  const [visibleHeaders, setVisibleHeaders] = useState([]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredRows, setFilteredRows] = React.useState([]);

  const [displayLength, setdisplayLength] = useState(10);
  const [displayStart, setdisplayStart] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const location = useLocation();
  const details = location.state;
  const navigates = useNavigate()
  const PageName = details.sName


  const handleDisplayStartChange = (newDisplayStart) => {
    setdisplayStart(newDisplayStart);
  };
  const handleDisplayLengthChange = (newDisplayLength) => {
    setdisplayLength(newDisplayLength);
  };
 

  // useEffect(() => {
   
  // }, [ProjectsList]);

  const handleExportToExcel = () => {
    if (ProjectsList.length > 0) {
      exportToExcel(ProjectsList, visibleHeaders, PageName,FromDate,TODate); // Pass your filtered/visibleRows data here
    }
  };




  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenImages = (images) => {
    if (images && images.sImages && images.sPath) {
      const Image = images.sImages;
      const Path = images.sPath;
      const imageArray = images.sImages.split(";");
      const imageUrlArray = imageArray.map(image => Path + image);
      setImages(imageUrlArray);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const buttonStyle = {
    textTransform: "none", // Set text transform to none for normal case
    color: `${secondaryColorTheme}`, // Set text color
    backgroundColor: `${buttonColors}`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const suggestionRistLevel = [
    { iId: 1, sName: "Low" },
    { iId: 2, sName: "Medium" },
    { iId: 3, sName: "High" },
  ];


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

    const GetUsers = async () => {
      try {
        const res = await GetUser({
          sSearch: ""
        })
        const data = JSON.parse(res?.ResultData)
        setEmployee(data.sName)
      } catch (error) {
        console.log(error);
      }
    }
    GetUsers()

    const GetAllEmployees = async () => {
      try {
        const res = await GetAllEmployee({
          sSearch: ""
        })
        const data = JSON.parse(res?.ResultData)
        setSupervisor(data.sName)
      } catch (error) {
        console.log(error);
      }
    }
    GetAllEmployees()

    const GetcloseStatuss = async () => {
      try {
        const res = await GetcloseStatus()
        const data = JSON.parse(res?.ResultData)
        setCloseStatus(data)
      } catch (error) {
        console.log(error);
      }
    }
    GetcloseStatuss()

    if (data && Object.keys(data).length > 0) {
      const result = suggestionRistLevel.find(
        (item) => item.iId === data?.iRiskLevel
      );
      setRiskLevel(result)
    }

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
      initiatedBy: 0,
      iActionBy: 0,
      iRisklevel: 0,
      istatus: 0,
      Search: ""
    }
  };

  useEffect(() => {
    const resetFormData = getInitialFormData();
    fetchData(resetFormData)
      }, [])

  // useEffect(() => {
  //   const newFormdata={
  //     DisplayLength: displayLength,
  //       DisplayStart: displayStart,
  //       FromDate: FromDate,
  //       ToDate: TODate,
  //       iProject: iProjects,
  //       initiatedBy: intiate,
  //       iActionBy: Action,
  //       iRisklevel: riskLevel,
  //       istatus: 0,
  //       Search: "",
  //   }
  //   fetchData(newFormdata)
  // }, [displayLength,displayStart])


    const handleClear = () => {
    const resetFormData = getInitialFormData();
    fetchData(resetFormData)
    setProject('')
    setEmployee('')
    setSupervisor('')
    setRiskLevel(0)
    setCloseStatus([])
  };

  // initialData SETTING FUNCTION-------------------------------------------
  const fetchData = async (initialData) => {
const newDisplayStart = page * rowsPerPage;

        handleOpen()
    try {
      const res = await HSEReactReport({
        DisplayLength: displayLength,
      DisplayStart: displayStart,
      FromDate: initialData.FromDate,
      ToDate: initialData.ToDate,
      iProject: initialData.iProject,
      initiatedBy: initialData.initiatedBy,
      iActionBy: initialData.iActionBy,
      iRisklevel: initialData.iRisklevel,
      istatus: initialData.istatus,
      Search: initialData.Search,
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
    handleOpen()
    try {
      const res = await HSEReactReport({
        DisplayLength: displayLength,
        DisplayStart: displayStart,
        FromDate: FromDate,
        ToDate: TODate,
        iProject: iProjects,
        initiatedBy: intiate,
        iActionBy: Action,
        iRisklevel: riskLevel,
        istatus: 0,
        Search: ""
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
    }else{
      setProject(0)
    }
  }
 
  const handleInitiate = async (obj) => {
    if (obj) {
      setinitiate(obj.iId)
      setEmployee(obj)
    }else{
      setEmployee(0)
    }
  }
  const hndleAction = async (obj) => {
    if (obj) {
      setAction(obj.iId)
    setSupervisor(obj)
    }else{
      setSupervisor(0)
    }
  }

  //PAGINATION AND SEARCH FUNCTION-------------------------------------------------
  const handleChangePage = (newPage) => {
    setPage(newPage);
    const newDisplayStart = newPage * rowsPerPage;
    handleDisplayStartChange(newDisplayStart);  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    const newDisplayStart = 0;
    handleDisplayStartChange(newDisplayStart);
    handleDisplayLengthChange(newRowsPerPage);
  };



  //SEARCH FUNCTION-----------------------------------------------------------
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
  }, [searchQuery, ProjectsList,page, rowsPerPage]);

  const clickClose = () => {
    navigates("/home");
  }

  const handleopenpdf = async (iTransId) => {
    const crystalRes = await CrystalPrint({
      iTransId: iTransId,
      iFormtype: 1,
    });
    window.open(crystalRes.ResultData, "_blank")
  }

  const handleClosedpdf = async (iTransDtId) => {
    if (iTransDtId) {
      const crystalRes = await CrystalPrint({
        iTransId: iTransDtId,
        iFormtype: 3,
      });

      window.open(crystalRes.ResultData, "_blank")
    }

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
              <Box sx={{ display: 'flex', gap: '9px' }}>
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
              </Box>
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
                          <AutoComplete2
                            apiName={GetUser}
                            value={Employee}
                            onChangeName={handleInitiate}
                          />
                        </div>
                      </div>
                    </MDBCol>
                    <MDBCol lg="3" md="4" sm="6" xs="12">
                      <div className="mb-3">
                        <div className="mb-3">
                          <AutoComplete3
                            apiName={GetAllEmployee}
                            value={Supervisor}
                            onChangeName={hndleAction}
                          />
                        </div>
                      </div>
                    </MDBCol>
                    <MDBCol lg="3" md="4" sm="6" xs="12">
                      <Autocomplete
                        id="risk-level-autocomplete"
                        options={suggestionRistLevel}
                        getOptionLabel={(option) => option.sName}
                        value={suggestionRistLevel.find((option) => option.iId === riskLevel) || null}
                        onChange={(event, newValue) => {
                          setRiskLevel(newValue ? newValue.iId : null);
                        }}
                        isOptionEqualToValue={(option, value) => option.iId === value.iId} // Custom equality test
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Risk Level"
                            InputProps={{
                              ...params.InputProps,
                              style: {
                                height: "38px", // Adjust the height here as per your requirement
                                ...params.InputProps.style,
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: '15px', // Adjust the font size as needed
                                height: '14px', // Adjust the height to match the input height
                                display: 'flex',
                                alignItems: 'center',
                              },
                            }}
                          />
                        )}
                      />
                    </MDBCol>


                    <MDBCol lg="3" md="4" sm="6" xs="12">

                      <div className="mb-3">

                        <AutocloseStatus
                          apiName={GetcloseStatus}
                          value={closeStatus}
                          onChangeName={setCloseStatus}
                        />
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

          <Box>
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
                    <TableContainer sx={{ maxHeight: "40vh", overflow: "scroll" }}>
                      <Table
                        stickyHeader
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                      >
                        <TableHead>
                          {filteredRows && filteredRows.length > 0 && (
                            <TableRow>
                              {Object.keys(filteredRows[0])
                                .filter((key) => key !== "totalRows" && key !== "sPath" && key !== "Observation" && key !== "ActionReq" && key !== "ProjectDes") // Exclude sPath from the keys
                                .map((key) => (
                                  <TableCell
                                    key={key}
                                    align={"left"}
                                    sx={{
                                      padding: "4px",
                                      border: " 1px solid #ddd",
                                      fontWeight: "600",
                                      font: "14px",
                                      backgroundColor: secondaryColorTheme,
                                      color: "white",
                                    }}

                                  >
                                    {key === "sImages" ? "Images" :
                                      key === "iTransId" ? "OpenPdf" :
                                        key === "iTransDtId" ? "Closed Pdf" :
                                          key === "RaisedBy" ? "InitiatedBy" :
                                            key}
                                  </TableCell>
                                ))}
                            </TableRow>
                          )}
                        </TableHead>

                        <TableBody>
                          {filteredRows && filteredRows.length > 0 && filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  sx={{ cursor: "pointer" }}
                                  key={row.iId} // Fix: Use row.id instead of row.iId
                                >

                                  {Object.keys(row)
                                    .filter((key) => key !== "totalRows" && key !== "sPath" && key !== "Observation" && key !== "ActionReq" && key !== "ProjectDes") // Exclude sPath from the keys
                                    .map((key, idx) => (
                                      <TableCell
                                        sx={{
                                          padding: "0px",
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
                                        {key === "sImages" ? (
                                          row[key] ? (
                                            <Button onClick={() => handleOpenImages(row)}>
                                              <ImageIcon />
                                            </Button>
                                          ) : (
                                            <><BrokenImageIcon sx={{ color: secondaryColorTheme }} /><span>No image</span></>// Display text if sPhoto is null or empty

                                          )

                                        ) : key === "iTransId" ? (
                                          <Button onClick={() => handleopenpdf(row[key])} >
                                            <PictureAsPdfIcon />
                                          </Button>
                                        ) : key === "iTransDtId" ? (
                                          <Button onClick={() => handleClosedpdf(row[key])}>
                                            <PictureAsPdfIcon />
                                          </Button>
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
        count={ProjectsList ? (ProjectsList.length > 0 ? ProjectsList[0].totalRows : 0) : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={(props) => (
                        <TablePaginationActions
                        {...props}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        ProjectsList={ProjectsList} // Pass ProjectsList as a prop
                        onChangePage={handleChangePage}
                      />
                      )}
                    // />
                 
                    //                 sx={{
                    //     display: "flex", // Use flexbox for the container
                    //     justifyContent: "space-between", // Space between the elements
                    //     alignItems: "center", // Center the elements vertically
                    //     ".MuiTablePagination-toolbar": {
                    //       justifyContent: "space-between",
                    //       alignItems: "center",
                    //       width: "100%", // Ensure the toolbar takes the full width
                    //     },
                    //     ".MuiTablePagination-spacer": {
                    //       flex: "1 1 100%", // Force the spacer to take up all available space
                    //     },
                    //     ".MuiTablePagination-selectLabel": {
                    //       margin: 0, // Adjust or remove margin as needed
                    //       display: "none"
                    //     },
                    //     ".MuiTablePagination-select": {
                    //       textAlign: "center", // Center the text inside the select input
                    //       display: "none"
                    //     },
                    //     ".MuiTablePagination-selectIcon": {
                    //       display: "none" // Adjust the position of the icon as needed
                    //     },
                    //     ".MuiTablePagination-displayedRows": {
                    //       textAlign: "left", // Align the "1-4 of 4" text to the left
                    //       flexShrink: 0, // Prevent the text from shrinking
                    //       order: -1, // Place it at the beginning

                    //     },
                    //     ".MuiTablePagination-actions": {
                    //       flexShrink: 0, // Prevent the actions from shrinking
                    //     },
                    //     // Add other styles as needed
                    //   }}
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

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const lastPage = Math.ceil(count / rowsPerPage) - 1;
  const startPage = Math.max(0, page - 2);
  const endPage = Math.min(lastPage, page + 2);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);

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
          key={pageNum}
          color={pageNum === page ? 'primary' : 'default'}
          onClick={() => handlePageButtonClick(pageNum)}
          disabled={pageNum > lastPage}
          sx={{
            width: '30px',
            height: '30px',
            padding: '0px',
            margin: '0px',
            borderRadius: '50%',
            color: 'inherit',
            backgroundColor: pageNum === page ? 'grey' : 'white',
            '&:hover': {
              backgroundColor: pageNum === page ? 'grey' : 'lightgrey',
            },
            '&.Mui-disabled': {
              backgroundColor: 'white',
            },
          }}
        >
          {pageNum + 1}
        </IconButton>
      ))}
      {page < lastPage && (
        <IconButton onClick={() => handlePageButtonClick(lastPage)} >
          <LastPageIcon />
        </IconButton>
      )}
    </div>
  );
};


// const TablePaginationActions = (props) => {
//   const { count, page, rowsPerPage, onPageChange } = props;

//   // Calculate the last page index
//   const lastPage = Math.ceil(count / rowsPerPage) - 1;

//   // Generate page numbers: we want to show 2 pages on each side if possible
//   const startPage = Math.max(0, page - 2); // Current page - 2, but not less than 0
//   const endPage = Math.min(lastPage, page + 2); // Current page + 2, but not more than last page

//   // Create an array of page numbers to be shown
//   const pages = Array.from(
//     { length: endPage - startPage + 1 },
//     (_, idx) => startPage + idx
//   );

//   const handlePageButtonClick = (newPage) => {
//     onPageChange(newPage);
//   };

//   return (
//     <div style={{ flexShrink: 0, marginLeft: 20 }}>
//       {page > 0 && (
//         <IconButton onClick={() => handlePageButtonClick(0)}>
//           <FirstPageIcon />
//         </IconButton>
//       )}
//       {pages.map((pageNum) => (
//         <IconButton
//         sx={{
//           width:"30px",
//           height:"30px",
//           padding: '0px',
//           margin: '0px',
//           borderRadius: '50%', // Make the background round
//           color: 'inherit',
//           backgroundColor: pageNum === page ? 'grey' : 'white',
//           '&:hover': {
//             backgroundColor: pageNum === page ? 'grey' : 'lightgrey', // Change hover color
//           },
//           '&.Mui-disabled': {
//             backgroundColor: 'white',
//           }
//         }}
          
//           key={pageNum}
//           color={pageNum === page ? "primary" : "default"}
//           onClick={() => handlePageButtonClick(pageNum)}
//           disabled={pageNum > lastPage}
//         >
//           {pageNum + 1}
//         </IconButton>
//       ))}
//       {page < lastPage && (
//         <IconButton onClick={() => handlePageButtonClick(lastPage)}>
//           <LastPageIcon />
//         </IconButton>
//       )}
//     </div>
//   );
// };

export default HSEreport
