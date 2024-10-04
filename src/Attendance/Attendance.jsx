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
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../components/Loader/Loader";
import SaveIcon from "@mui/icons-material/Save";
import { buttonColors, secondaryColorTheme } from "../../src/config";

import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { Details } from "@mui/icons-material";
import Swal from "sweetalert2";
import Header from "../components/Header/Header";
import {
  AttendanceSummary,
  AttendanceSummary_Web,
  DeleteAttendance,
  getSupervisor_attendance,
} from "../api/apiHelper";
import AutoComplete2 from "./components/AutoComplete/AutoComplete2";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import EnhancedTable from "./components/Tables/AttendanceTable";
import AttendanceNew from "./components/PopUpattendance/AttendanceNew";
import EnhancedTableLog from "./components/Tables/AttendanceLogTable";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import Footer from "../components/Footer/Footer";
import { getActionBasedOnuser } from "../api/settingsApi";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `${secondaryColorTheme}`, // Set text color
  backgroundColor: `${buttonColors}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

function Attendance() {
  const getInitialFormData = () => {
    const initialToDate = new Date();
    const initialFromDate = new Date();
    initialFromDate.setDate(initialToDate.getDate() - 7);
    // initialFromDate.setDate(1);

    return {
      FromDate: initialFromDate.toISOString().split("T")[0],
      ToDate: initialToDate.toISOString().split("T")[0],
      sEmp: "",
      iEmployee: 0,
      sProj: "",
      iProject: 0,
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
  const [openAlert, setOpenAlert] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [actions, setActions] = useState([]);

  

  const buttonStyle2 = {
    textTransform: "none", // Set text transform to none for normal case
    color: ` ${buttonColors}`, // Set text color
    backgroundColor: `${secondaryColorTheme}`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    padding: "6px 10px",
  };


  const iUser = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";
  const location = useLocation();
  const pageTitle = location.state?.attendancePage;

  const prevPageTitleRef = useRef(pageTitle?.iScreenId);

  const navigate = useNavigate();

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


  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };
  const handleOpenAlert = () => {
    setWarning(true);
  };
  const handleDeleteClick = (event) => {
    const iIds = selectedDatas.map((row) => [
      row.iAttendance_In,
      row.iAttendance_Out,
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
  };
  const handleDeleteClose = () => {
    setAnchorElDelete(null);
  };
  const handleSelectedRowsChange = (selectedRowsData) => {
    setselectedDatas(selectedRowsData);
  };
  const handleEdit = () => {
    const iIds = selectedDatas.map((row) => [
      row.iAttendance_In,
      row.iAttendance_Out,
    ]);
    setselectediIds(iIds);
    if (iIds.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Select Row To Edit",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      if (pageTitle.iScreenId !== 12) {
        setMode("editProject"); // Set mode to editProject if pageTitle is not Attendance Manager
      } else {
        setMode("edit");
      }
      setnewOpen(true); // Assuming this state controls the visibility of the AttendanceNew component
    }
  };
  const handleRowDoubleClick = (row) => {
    const hasEditAccess = actions.some(action => action.iActionId === 3)
    if (row === null || !hasEditAccess) {
      return null
    } else {
      setselectedDatas(row);
      if (pageTitle.iScreenId !== 12) {
        setMode("editProject"); // Set mode to editProject if pageTitle is not Attendance Manager
      } else {
        setMode("edit");
      }
      setnewOpen(true);
    }
  };
  const resetChangesTrigger = () => {
    setchangesTriggered(false);
  };
  const handleDelete = async () => {
    const stringWithComma = selectediIds.join(",");

    const formDataDelete = {
      iId: `${stringWithComma}`,
      iUser: iUser,
    };

    try {
      // Logic to delete selected rows
      // This might involve calling an API or updating your data source

      const response = await DeleteAttendance(formDataDelete);

      setselectedDatas([]);
      setselectediIds([]);
      setchangesTriggered(true);
      setAnchorElDelete(null);
    } catch (error) {
      console.log(error);
      setchangesTriggered(true);
      setAnchorElDelete(null);
    }
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
  const handleNewClick = () => {
    setMode("new");
    setnewOpen(true);
  };
  const handleNewClose = () => {
    setnewOpen(false);
    seteditOpen(false);
    setchangesTriggered(true);
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
    if (dayDiff > 30) {
      Swal.fire({
        title: "Error!",
        text: "The date range should not exceed 31 days",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }
    try {
      handleOpen();
      const FromDate = formData.FromDate;
      const ToDate = formData.ToDate;
      const iEmployee = formData.iEmployee;
      const iProject = formData.iProject;
      if (pageTitle.iScreenId !== 11) {
        const response = await AttendanceSummary_Web({
          displayLength,
          displayStart,
          FromDate,
          ToDate,
          iEmployee,
          iProject,
          searchKey,
        });
        const updatedData = response.map(({ ...rest }) => rest);

        // Set the state with the updated data
        setdata(updatedData);
      } else {
        const response = await AttendanceSummary({
          displayLength,
          displayStart,
          FromDate,
          ToDate,
          iEmployee,
          iProject,
          searchKey,
        });
        const updatedData = response.map(({ ...rest }) => rest);

        // Set the state with the updated data
        setdataLog(updatedData);
      }

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
      const iProject = formDataToUse.iProject;

      const response =
        pageTitle.iScreenId !== 11
          ? await AttendanceSummary_Web({
              displayLength,
              displayStart,
              FromDate,
              ToDate,
              iEmployee,
              iProject,
              searchKey,
            })
          : await AttendanceSummary({
              displayLength,
              displayStart,
              FromDate,
              ToDate,
              iEmployee,
              iProject,
              searchKey,
            });

      const updatedData = response.map(({ ...rest }) => rest);
      if (pageTitle.iScreenId !== 11) {
        setdata(updatedData);
      } else {
        setdataLog(updatedData);
      }
      // handleClose(); // Hide loader
    } catch (error) {
      console.error(error);
      // handleClose(); // Hide loader
    }
  };

  useEffect(() => {
    if (prevPageTitleRef.current === pageTitle) {
      // Only fetch data if pageTitle hasn't changed, implying searchKey triggered the update
      fetchData(formData);
    }
  }, [
    displayLength,
    displayStart,
    sortCol,
    sortDir,
    searchKey,
    newOpen,
    anchorElDelete,
    editOpen,
  ]);

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
            paddingBottom: "50px",
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
                {pageTitle.sScreen}
              </Typography>
            </Box>
            <Stack direction="row"
      spacing={1}
      padding={1}
      justifyContent="flex-end">
              {/* {pageTitle.iScreenId === 12 && (
                <Button
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
              )}
              {pageTitle.iScreenId !== 11 && (
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
              )}
              {pageTitle.iScreenId === 12 && (
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
              )}
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
                      onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                      onFocus={(e) => e.target.showPicker?.()} // Fallback for when the field is focused
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
                      required={false}
                    />
                  </div>
                </MDBCol>
                {pageTitle.iScreenId !== 55 && (
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <AutoComplete2
                        formData={formData}
                        setFormData={setFormData}
                        autoId={`projects`}
                        label={"Projects"}
                        apiKey={"GetProject?iStatus=1"}
                        formDataName={"sProj"}
                        formDataiId={"iProject"}
                        required={false}
                      />
                    </div>
                  </MDBCol>
                )}
                {pageTitle.iScreenId === 55 && (
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <AutoComplete2
                        formData={formData}
                        setFormData={setFormData}
                        autoId={`projects`}
                        label={"Projects"}
                        apiKey={`GetProject_User?iUser=${iUser}`}
                        formDataName={"sProj"}
                        formDataiId={"iProject"}
                        required={false}
                      />
                    </div>
                  </MDBCol>
                )}

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

          {pageTitle.iScreenId !== 11 && (
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
          )}
          {pageTitle.iScreenId === 11 && (
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
              />
            </MDBCard>
          )}
        </Box>
        {newOpen && (
          <AttendanceNew
            isOpen={newOpen}
            handleNewClose={handleNewClose}
            mode={mode}
            actions= {actions}
            formDataEdit={
              mode === "edit" || mode === "editProject" ? selectedDatas : null
            }
          />
        )}
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
      <Footer />
    </>
  ) : null;
}

export default Attendance;
