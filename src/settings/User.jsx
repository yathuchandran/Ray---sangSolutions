import React, { useEffect, useState } from 'react'
import { Box, Paper } from '@mui/material';
import Stack from "@mui/material/Stack";
import { Button, ButtonGroup, TextField } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
  Autocomplete,

  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Popover,
} from "@mui/material";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,

} from "mdb-react-ui-kit";
import Swal from "sweetalert2";

import Header from "../components/Header/Header";
import EnhancedTable from "./table/UserSummaryTable";
import { buttonColors, secondaryColorTheme } from "../config";
import { DeleteUsers, GetUserDetail, GetUserSummary, getActionBasedOnuser } from '../api/settingsApi';

import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import exportToExcel from '../ReportComponents/ReportSummary/ExportTOexcel';
import Loader from '../components/Loader/Loader';
import NewModal from './popupTab/NewModal';







function User() {
  const iUser = localStorage.getItem("userId")? Number(localStorage.getItem("userId")) : ""
  
  const location = useLocation();
  const navigates = useNavigate()

  const [displayLength, setdisplayLength] = useState(10);
  const [displayStart, setdisplayStart] = useState(0);
  const [sortCol, setsortCol] = useState(0);
  const [sortDir, setsortDir] = useState(0); //asc or desc
  const [searchKey, setsearchKey] = useState("");
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

  const [data, setdata] = useState([]);
  const [visibleHeaders, setVisibleHeaders] = useState([]);
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

  const details = location.state;
  const PageName = details.sName
  

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

  //EXPORT TO EXCEL SHEET-----------------------------------------------------
  const handleExportToExcel = async() => {
    try {
      const res = await GetUserSummary({
        DisplayLength: 0,
        DisplayStart: 0,
        Search: searchKey,
      })
      if (res.length > 0) {
        exportToExcel(res, visibleHeaders, PageName); // Pass your filtered/visibleRows data here
      }
    } catch (error) {
      console.log(error, "GetUserSummarys");
    }


    
  };

  //API DATA CALLING USEEFECT----------------------------------------------
  useEffect(() => {
    const GetUserSummarys = async () => {
      try {
        const res = await GetUserSummary({
          DisplayLength: displayLength,
          DisplayStart: displayStart,
          Search: searchKey,
        })
        setdata(res)
      } catch (error) {
        console.log(error, "GetUserSummarys");
      }
    }
    GetUserSummarys()   
  }, [changesTriggered,displayLength,displayStart,searchKey])

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
  }
  const resetChangesTrigger = () => {
    setchangesTriggered(false);
  };

  const handleSelectedRowsChange = (selectedRowsData) => {
    setselectedDatas(selectedRowsData);
  };

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
  };
  const handleDeleteClose = () => {
    setAnchorElDelete(null);
  };


  const handleEdit = () => {
    const iIds = selectedDatas.map((row) => [
      row.iId,
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
      setMode("edit"); // Set mode to editProject if pageTitle is not Attendance Manager
     
      setnewOpen(true); // Assuming this state controls the visibility of the AttendanceNew component
    }
  };


  const handleRowDoubleClick = (row) => {
    const hasEditAccess = actions.some(action => action.iActionId === 3)
    if (row === null || !hasEditAccess) {
      return null
    } else {
      setselectedDatas(row);
      setMode("edit");
      setnewOpen(true);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
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

      const response = await DeleteUsers(formDataDelete);

      setselectedDatas([]);
      setselectediIds([]);
      setchangesTriggered(true);
      setAnchorElDelete(null);

      if (response.Status == "Success") {
        Swal.fire({
          title: "Success!",
          text: `${response.MessageDescription}`,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        })
        setMessage(
          `Success`
        );
        return;
      }
      if (response.Status == "Error") {
        Swal.fire({
          title: "Error!",
          text: `${response.MessageDescription}`,
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: secondaryColorTheme,
        })
        setMessage(
          `Error`
        );
        return;
      }
      if (response.Status == "Warning") {
        Swal.fire({
          title: "Warning!",
          text: `${response.MessageDescription}`,
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor: secondaryColorTheme,
        })
        setMessage(
          `warning`
        );
        return;
      }

       
    } catch (error) {
      console.log(error, "DeleteUsers error");
      setchangesTriggered(true);
      setAnchorElDelete(null);
    }
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






  const clickClose = () => {
    navigates("/home");
  }

  return (
    <div>
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
                {PageName}
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', gap: '9px' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                style={buttonStyle}
                onClick={handleNewClick}
                sx={{
                  ...buttonStyle,
                  fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                  padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                }}
              >
                New
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                style={buttonStyle}
                onClick={handleEdit}
                sx={{
                  ...buttonStyle,
                  fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                  padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                style={buttonStyle}
                onClick={handleDeleteClick}
                sx={{
                  ...buttonStyle,
                  fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                  padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                }}
              >
                Delete
              </Button>
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
      {renderButton(2, "New", handleNewClick, <AddIcon />)}
      {renderButton(3, "Edit", handleEdit, <EditIcon />, selectedDatas.length !== 1)}
      {renderButton(4, "Delete", handleDeleteClick, <DeleteIcon />, selectedDatas.length === 0)} 
      {renderButton(7, "Excel", handleExportToExcel, <PrintIcon />, data.length === 0)}
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
          <Paper
            sx={{
              width: "100%",
              mb: 2,
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <MDBCard
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                zIndex: 1,
                marginTop: 20,
              }}
            >
              <Loader open={open} handleClose={handleClose} />

              <EnhancedTable
                key={details.iScreenId}
                rows={data}
                onDisplayLengthChange={handleDisplayLengthChange}
                onDisplayStartChange={handleDisplayStartChange}
                onSortChange={handleSortChange}
                onSearchKeyChange={handleSearchKeyChange}
                pageTitle={details.iScreenId}
                changesTriggered={changesTriggered}
                setchangesTriggered={resetChangesTrigger}
                onSelectedRowsChange={handleSelectedRowsChange}
                onRowDoubleClick={handleRowDoubleClick}
              />
            </MDBCard>


          </Paper>
        </Box>
        {newOpen && (
          <NewModal
            isOpen={newOpen}
            handleNewClose={handleNewClose}
            mode={mode}
            actions= {actions}
            formDataEdit={
              mode === "edit"  ? selectedDatas : null
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

    </div>
  )
}

export default User