import React, { useCallback, useEffect, useRef, useState } from "react";
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
  MDBTextArea,
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
import "./chatbox.css";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Header from "../../components/Header/Header";
import EnhancedTable from "./ChatBoxTable";
import {
  BestEmployeeSummary,
  ChatDetails,
  ChatSummary,
  DeleteBestEmployee,
  DeleteChat,
  FileUploadChatBox,
  PostBestEmployee,
  PostChat,
} from "../../api/apiHelper";
import Loader from "../../components/Loader/Loader";
import CheckBox from "./CheckBox/CheckBox";
import DownloadIcon from "@mui/icons-material/Download";
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
const tableHeaderStyle ={
   border: '1px solid #ddd', padding: '2px', backgroundColor: secondaryColorTheme, color: 'white' 
}
const tableBodyStyle ={
  border: '1px solid #ddd', padding: '2px', 
}
function ChatBox() {
  const iUser = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";

  const currentYear = new Date().getFullYear(); // Get the current year
  const currentMonth = new Date().getMonth() + 1; // Get the current month (getMonth() returns 0-11)
  const years = Array.from(
    { length: currentYear - 2019 },
    (v, k) => currentYear - k
  );
  const getInitialFormData = () => {
    const initialToDate = new Date();
    const initialFromDate = new Date();
    // initialFromDate.setDate(initialToDate.getDate() - 30);
    // initialFromDate.setDate(1);
    const fileInput = document.getElementById('chatboxfiles');
    if (fileInput) {
      fileInput.value = ''; // Clear the file input field
    }
    
    return {
      iId: 0,
      iUser: iUser,
      sStartDate: initialFromDate.toISOString().split("T")[0],
      sEndDate: initialToDate.toISOString().split("T")[0],
      sSubject: "",
      sMessage: "",
      ChatDetails:[],
      sAttachment:""
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
  const [existingFiles, setexistingFiles] = useState([])
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [receiverListExist, setreceiverListExist] = useState("")
  const [allFiles, setAllFiles] = useState([]);
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
  const pageTitle = location.state;

  const prevPageTitleRef = useRef(pageTitle?.iScreenId);
  const newFileRef = useRef();

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

  // Handler for file input change
   // Handler for file input change
   const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      newFileRef.current = file; // Store the file in the ref
    }
  };

  // Handler for the Add button click
  const handleAddFile = async() => {
    const fileInput = document.getElementById('chatboxfiles'); // Replace with your actual file input ID
    const fileToAdd = newFileRef.current;
    const formData1 = new FormData();

    try {
      
   
    
    if (fileToAdd) {
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, ""); // Create a timestamp
      
      const nameParts = fileToAdd.name.split('.'); // Split the file name to separate the extension
      const extension = nameParts.pop().toLowerCase(); // Remove the last part (extension)
      const baseName = nameParts.join('.'); // Rejoin the remaining parts in case the name contained periods
      const modifiedName = `${baseName}__${iUser}_${timestamp}.${extension}`; // Construct the modified name

      formData1.append("iType",11);
    formData1.append("imageFiles", fileToAdd,modifiedName);
    const response = await FileUploadChatBox(formData1);
    
    if(response?.Status =="Success"){
      setFiles((prevFiles) => [...prevFiles, fileToAdd]);
      setAllFiles(prevFiles => [
        ...prevFiles,
        {
            url: null, // URL to access the uploaded file
            file: fileToAdd, // File object
            name: modifiedName // Name of the file
        }
    ]);
    setFileNames(prevNames => [...prevNames, modifiedName]);
      newFileRef.current = null; // Clear the ref
  
      if (fileInput) {
        fileInput.value = ''; // Clear the file input field
      }
      
    }else{
      Swal.fire({
        title: "Error!",
        text: "Error in Uploading",
        icon: "error",
        confirmButtonText: "OK",
      });
      newFileRef.current = null; // Clear the ref
  
      if (fileInput) {
        fileInput.value = ''; // Clear the file input field
      }
    }
     
    }else{
      Swal.fire({
        title: "Error!",
        text: "Select file",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
      console.log(error);
  }
  };

  const handleDownload = (fileObj) => {
    if (fileObj.url) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const fileNameParts = fileObj.name.split('.');
      const extension = fileNameParts[fileNameParts.length - 1].toLowerCase();
  
      if (imageExtensions.includes(extension)) {
        // Handle images: display in a new tab
        const htmlContent = `<html>
                               <head><title>Image Viewer</title></head>
                               <body><img src="${fileObj.url}" style="max-width: 100%; height: auto;"></body>
                             </html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } 
      else{
      // It's an existing file, download it from the URL
      const link = document.createElement('a');
      link.href = fileObj.url;
      link.download = fileObj.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    } else if (fileObj.file) {
      // It's a newly uploaded file, create a URL and download it
      const url = window.URL.createObjectURL(fileObj.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileObj.name;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  };
  


 

  // const handleDeleteFile = (index) => {
  //   const updatedFiles = allFiles.filter((_, i) => i !== index);
  //   setAllFiles(updatedFiles);
  // };
  // Handler for the Delete button click
  const handleDeleteFile = (index) => {
    // Filter out the file at the specific index
    const newFiles = allFiles.filter((_, i) => i !== index);
    const newFileNames = fileNames.filter((_, i) => i !== index);
    setAllFiles(newFiles);
    setFiles([]);
    setFileNames(newFileNames);
  };
  const setcheckBoxData =(data) => {
    const ChatDetails = data.ChatDetails;
    setFormData({ ...formData, ChatDetails });
  }
  const handleDateChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    
  };
 
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
    setreceiverListExist("")
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClear = () => {
    const fileInput = document.getElementById('chatboxfiles');
    if (fileInput) {
      
      newFileRef.current = ''; // Clear the file input field
      fileInput.value = ''
    }
    const resetFormData = getInitialFormData();
    setFormData(resetFormData);
    setdisplayLength(10);
    setdisplayStart(0);
    setsearchKey("");
    setchangesTriggered(true);
    setFileNames([])
    setFiles([])
    setAllFiles([])
    // As we want to fetch data only when pageTitle changes,
    // we call the fetchData function directly in this effect.
    fetchData();
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
  const getDetails = async(iId)=>{
    try {
      if(!iId){
        handleClear()
        return
      }
    
      const fileInput = document.getElementById('chatboxfiles');
    if (fileInput) {
      
      newFileRef.current = ''; // Clear the file input field
      fileInput.value = ''
    }
     
      const response = await ChatDetails({iId})
     
      const resultData = JSON.parse(response.ResultData).Table[0]
      const resultData1 = JSON.parse(response.ResultData).Table1
      const dateParts = resultData.sStartDate.split("-");
      const formattedStartDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const endDateParts = resultData.sEndDate.split("-");
      const formattedEndDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;
      const iUserString = resultData1.map(item => item.iUser).join(',');
    
      setreceiverListExist(iUserString)

      //handling attachments
      
      const basePath = resultData.sPath;
      const attachmentNames = resultData.sAttachment ? resultData.sAttachment.split(';') : [];
      const attachmentUrls = attachmentNames.map(name => ({ 
        url: basePath + name,
        file: null, // Existing files do not have a File object initially
        name
      }));
      setAllFiles([...attachmentUrls]);

      
    
    // setexistingFiles(attachmentUrls)
    setFileNames(prevNames => [...attachmentNames]); // Set file names as the attachments names

      const newData = {
        iId: resultData.iId,
        iUser: iUser,
        sStartDate: formattedStartDate,
        sEndDate: formattedEndDate,
        sSubject: resultData?.sSubject ?? "",
        sMessage: resultData?.sMessage ?? "",
        ChatDetails:resultData1,
        sAttachment:resultData?.sAttachment ?? ""
      };
      setFormData(newData);
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleRowDoubleClick = async(row) => {
    const hasEditAccess = actions.some(action => action.iActionId === 3)
    if (row === null || !hasEditAccess) {
      return null
    } else {
      const iId = row.iId
     
      getDetails(iId)
    }
  };
  const handleSearchKeyChange = (newSearchKey) => {
    setsearchKey(newSearchKey);
  };
  const handleNewClick = () => {
    handleClear();
  };
  const handleEdit = async() => {
    if (selectedDatas.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Select Row To Edit",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
     const iId = selectedDatas[0].iId
     getDetails(iId)
      
    }
  };
  const handleDeleteClick = (event) => {
    
    const iIds = selectedDatas.map((row) => [row.iId]);
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
  const handleDelete = async () => {
    const stringWithComma = selectediIds.join(",");

    // if(!iUser){
    //   navigate("/")
    // }

    const iIds = stringWithComma;

    
    try {
      const response = await DeleteChat({ iIds, iUser });
      
      if (response?.Status === "Success") {
        Swal.fire({
          title: "Deleted",
          text: response.MessageDescription,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handleClear();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          confirmButtonColor: "#3085d6",
        });
      }
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
  
  const handleSave = async () => {
    if (!isOnline) {
      // Swal.fire({
      //   title: "Error!",
      //   text: "No Internet Connection",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      //   confirmButtonColor: secondaryColorTheme,
      // });
      handleOpenAlert();
      setMessage(`No Internet Connection`);
      return; // Return early if offline
    }
    const fromDate = new Date(formData.sStartDate);
const toDate = new Date(formData.sEndDate);

// Normalize fromDate and toDate to start of the day for accurate comparison
fromDate.setHours(0, 0, 0, 0);
toDate.setHours(0, 0, 0, 0);

const today = new Date();
// Normalize today to the start of the day
today.setHours(0, 0, 0, 0);

const timeDiff = toDate - fromDate;
const dayDiff = timeDiff / (1000 * 3600 * 24);

if (!formData.sStartDate || !formData.sEndDate) {
  Swal.fire({
    title: "Error!",
    text: "Please Enter Start Date & End Date",
    icon: "error",
    confirmButtonText: "OK",
  });
  return; // Stop execution if the date range is invalid
}

// Check if fromDate is a past date
if (fromDate < today) {
  Swal.fire({
    title: "Error!",
    text: "Invalid StartDate",
    icon: "error",
    confirmButtonText: "OK",
  });
  return; // Stop execution if the start date is in the past
}

// Check if toDate is before fromDate
if (dayDiff < 0) {
  Swal.fire({
    title: "Error!",
    text: "End Date should be greater than or equal to Start Date",
    icon: "error",
    confirmButtonText: "OK",
  });
  return; // Stop execution if the date range is invalid
}
    if (formData.sSubject === "") {
      Swal.fire({
        title: "Error!",
        text: "Subject is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      
      return;
    }
    if (formData.sMessage === "") {
      Swal.fire({
        title: "Error!",
        text: "Message is required",
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
    if (formData.ChatDetails.length===0) {
      Swal.fire({
        title: "Error!",
        text: "Receiver is required",
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
      navigate("/");
    }
    try {
      const updatedFormData = {
        iId: formData.iId,
        iUser: iUser,
        sStartDate:formData.sStartDate ,
        sEndDate: formData.sEndDate,
        sSubject: formData.sSubject,
        sMessage: formData.sMessage,
        ChatDetails:formData.ChatDetails,
        sAttachment: fileNames.length > 1 ? fileNames.join(';') : fileNames[0] || ''
      };
      if (updatedFormData.sAttachment.length > 1000) {
        Swal.fire({
            title: 'Warning!',
            text: 'File upload limit exceeded',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return; // Stop the function execution here
      }
      const response = await PostChat(updatedFormData);
      
      if (response.MessageDescription === "Inserted successfully") {
        Swal.fire({
          title: "Saved",
          text: "Inserted successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handleClear();
        });
      } else if (response.MessageDescription === "Updated successfully") {
        Swal.fire({
          title: "Updated",
          text: "Updated successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          handleClear();
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.MessageDescription,
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
        handleClear();
      }
     
    } catch (error) {
      console.log(error);
      setchangesTriggered(true);
    }
  };

  useEffect(() => {
    if (!pageTitle) {
      navigate("/home");
    }
  }, [pageTitle, navigate]);

  

  const fetchData = async () => {
    // handleOpen(); // Show loader
    try {
      
     
      const response = await ChatSummary({
        displayLength,
        displayStart,
        searchKey,
       
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
    
    fetchData();
  }, [
    displayLength,
    displayStart,
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
            maxHeight:"90vh",
            overflowY:"scroll",
            scrollbarWidth:"thin"
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
                    <MDBInput
                      required
                      id={`form3Example`}
                      type="date"
                      size="small"
                      label="Start Date"
                      value={formData.sStartDate}
                      onChange={(e) =>
                        handleDateChange("sStartDate", e.target.value)
                      }
                      labelStyle={{
                        fontSize: "15px",
                      }}
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
                      label="End Date"
                      value={formData.sEndDate}
                      onChange={(e) =>
                        handleDateChange("sEndDate", e.target.value)
                      }
                      labelStyle={{
                        fontSize: "15px",
                      }}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      required
                      value={formData.sSubject}
                      id="form6Example3"
                      label="Subject"
                      name="sSubject"
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                    {/* {formData.sSubject.length === 100 && (
      <div style={{ color: '#ff0000', fontSize: '0.75rem' }}>
        Maximum characters reached.
      </div>
    )} */}
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBTextArea
                      type="textarea" // Specify the type as textarea for multiline input
                      required
                      value={formData.sMessage}
                      id="chatBoxMessage"
                      label="Message"
                      name="sMessage"
                      onChange={handleInputChange}
                      maxLength={500}
                      rows="3"
                      // style={{ fontSize:"14px" }}
                    />
                    {/* {formData.sMessage.length === 500 && (
      <div style={{ color: '#ff0000', fontSize: '0.75rem' }}>
        Maximum characters reached.
      </div>
    )} */}
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <CheckBox
                      sFieldName="iUser"
                      label="Receivers"
                      isMandatory={false}
                      setcheckBoxData={setcheckBoxData}
                      disabled={false}
                      changesTriggeredCheck={changesTriggered}
                      setchangesTriggeredCheck={resetChangesTrigger}
                      companyListExist={receiverListExist}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="/*"
                      id="chatboxfiles"
                    />
                    <button
                      style={{
                        width: "60px",
                        border: "1px solid ",
                        marginTop: "2px",
                      }}
                      onClick={handleAddFile}
                      disabled={!actions.some(action => action.iActionId === 8)}
                    >
                      Add
                    </button>
                  </div>
                </MDBCol>
                <MDBCol lg="6" md="6" sm="12" xs="12">
                  <div className="mb-3">
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>
                            <Typography>Sl.No</Typography>
                          </th>
                          <th style={tableHeaderStyle}>
                            <Typography>FileName</Typography>
                          </th>
                          <th style={tableHeaderStyle}>
                            <Typography>Download</Typography>
                          </th>
                          <th style={tableHeaderStyle}>
                            <Typography>Delete</Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allFiles.map((fileObj, index) => {
                           const displayNameParts = fileObj.name.split('__');
                           const displayName = displayNameParts[0] + '.' + displayNameParts.pop().split('.').pop();
                          return (
                            <tr key={index}>
                            <td style={tableBodyStyle}>{index + 1}</td>
                            <td style={tableBodyStyle}>{displayName}</td>
                            <td style={tableBodyStyle}>
                              <DownloadIcon
                                sx={{
                                  color: secondaryColorTheme,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDownload(fileObj)}
                              />
                            </td>
                            <td style={tableBodyStyle}>
                              <DeleteIcon
                                sx={{
                                  color: secondaryColorTheme,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDeleteFile(index)}
                              />
                            </td>
                          </tr>
                          )
                        }
                         
                        )}
                      </tbody>
                    </table>
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
              //onRowDoubleClick={handleRowDoubleClick}
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

export default ChatBox;
