import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  tooltipClasses,
  withStyles,
} from "@mui/material";

import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBTextArea,
} from "mdb-react-ui-kit";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { styled } from '@mui/system';
// import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import BasicDateTimePicker from "../DateAndTime";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import AutoComplete2 from "../../Attendance/components/AutoComplete/AutoComplete2";
import { buttonColors, secondaryColorTheme } from "../../config";
import { GetCompany, GetEditRoleDetail, GetScreens, PostRoles, PostUsers } from "../../api/settingsApi";
import GetRoleAutocomplete from "../autoComplete/GetRoleAutocomplete";




export default function RoleNwModal({
  isOpen,
  handleNewClose,
  formDataEdit,
  mode,
}) {
  const customFormGroupStyle = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxHeight: '150px', // Adjust as needed
    overflowY: 'auto', // Hide vertical overflow
    overflowX: 'scroll', // Allow horizontal scrolling
    padding: '10px',
    width:'100%'
  };

  const customFormControlLabelStyle = {
    '& .MuiCheckbox-root': {
      color: '#3f51b5', // Change checkbox color as needed
    },
    '& .MuiTypography-root': {
      marginLeft: '5px', // Adjust label spacing
    },
  };
  const iUser = localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : ""

  const getInitialFormData = () => {


    return {
      sRoleName: "",
      iRoleId: 0,
      iUser: iUser,
      RoleDetails: [
        {
          iScreenId: 0
        }
      ],
    }
  };



  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [formData, setFormData] = useState([]);
  const [open, setOpen] = React.useState(false); //loader
  const [mode1, setMode1] = useState("");
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");

  const [company, setCompany] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([]); // State to hold selected companies
  const [searchTerm, setSearchTerm] = useState('');

  const modalStyle = {
    display: isOpen ? "block" : "none",
    position: "absolute"
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };
  const handleOpenAlert = () => {
    setWarning(true);
  };
  const newButtonClick = () => {
    setFormData(
      getInitialFormData());
    setSelectedCompanies([])
    setMode1("new");
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const buttonStyle = {
    textTransform: "none",
    color: `${buttonColors}`,
    backgroundColor: `${secondaryColorTheme}`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleItemToggle = (iId) => {
    setSelectedCompanies((prevItems) => {
      if (Array.isArray(prevItems)) { // Check if prevItems is an array
        if (prevItems.includes(iId)) {
          return prevItems.filter((id) => id !== iId); // Deselect if already selected
        } else {
          return [...prevItems, iId]; // Select if not selected
        }
      } else {
        return [iId]; // If it's not an array, initialize with iId
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === company.length) {
      setSelectedCompanies([]);
    } else {
      const allCompanyIds = company.map((companyItem) => companyItem.iId);
      setSelectedCompanies(allCompanyIds);
    }
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleSaveAccount = async () => {

    if (!formData.sRoleName) {
      Swal.fire({
        title: "Error!",
        text: "Name is required",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return;
    }


    const datta = selectedCompanies.map(companyId => ({ iScreenId: companyId }))
    
    // Function to check if at least one checkbox is selected
    const isCompanySelected = () => {
      return datta.length > 0; 
    };
    if (!isCompanySelected()) {
      // If neither Web User nor Mobile User checkbox is selected
      Swal.fire({
        title: "Error!",
        text: "Please select a Screens",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: secondaryColorTheme,
      });
      return; // Prevent form submission
    }
    try {
      const res = await PostRoles({
        sRoleName: formData.sRoleName,
        iRoleId: formData.iRoleId,
        iUser: iUser,
        RoleDetails: datta
      })
      //SWAL-ALERT MESSAGES--------------------------------------------------------------------------------

      if (res.Status === "Success") {
        if (res.MessageDescription === "Inserted successfully" || res.MessageDescription === "Updated successfully") {
          Swal.fire({
            title: "Success!",
            text: `${res.MessageDescription}`,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });

        } else {
          handleOpenAlert();
          setMessage(`${res.MessageDescription}`);
          return;
        }
      }


      handleNewClose()
    } catch (error) {
      console.log("handleSave Post Error", error);
    }


  }
  // GET COMPANY API CALLLL-----------------------------------------------------
  useEffect(() => {
    const GetScreen = async () => {
      try {
        const res = await GetScreens()
        const data = JSON.parse(res.ResultData)
        setCompany(data)
      } catch (error) {
        console.log(error);
      }
    }
    GetScreen()
  }, [])




  useEffect(() => {
    setMode1(mode);
  }, [mode]);

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


  //EDITE CASE------------------------------------------------------
  useEffect(() => {
    if (mode1 === "edit" && formDataEdit) {

      const editData = Array.isArray(formDataEdit)
        ? formDataEdit[0]
        : formDataEdit;

      if (typeof editData !== "object" || editData === null) {
        console.error("editData is not an object:", editData);
        return;
      }

      const GetEditRoleDetails = async () => {
        try {
          const res = await GetEditRoleDetail({
            iId: editData.iId
          })
          const data = JSON.parse(res.ResultData).Table[0]
          const data1 = JSON.parse(res.ResultData).Table1

          setFormData({
            ...formData,
            sRoleName: data.sRoleName,
            iRoleId: editData.iId

          })
          const extractedIds = data1.map(item => item.iId);

          setSelectedCompanies(extractedIds)


        } catch (error) {
          console.log(error);
        }
      }
      GetEditRoleDetails()
    } else if (mode1 === "new") {
      setFormData(getInitialFormData());
    }
  }, [mode1, formDataEdit]);


  return (
    <div><div
      className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
      style={{
        display: isOpen ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    ></div>
      <Zoom in={isOpen} timeout={isOpen ? 400 : 300}>
        <div
          className={`modal ${isOpen ? "modal-open" : ""}`}
          style={modalStyle}
        >
          <div style={{ marginTop: "10%", width: "70%", marginLeft: "200px" }} >
            <div className="modal-content">
              <Stack
                direction="row"
                spacing={1}
                padding={1}
                justifyContent="flex-end"
              >
                {/* {(mode1 === "new" || mode1 === "edit") && ( */}
                <>
                  <Button
                    onClick={newButtonClick}
                    variant="contained"
                    startIcon={<AddIcon />}
                    style={buttonStyle}
                  >
                    New
                  </Button>

                  <Button
                    // type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    style={buttonStyle}
                    onClick={handleSaveAccount}
                  >
                    Save
                  </Button>
                </>
                {/* )} */}

                <Button
                  onClick={handleNewClose}
                  variant="contained"
                  startIcon={<CloseIcon />}
                  style={buttonStyle}
                >
                  Close
                </Button>
              </Stack>
              <Box
                sx={{
                  width: "auto",
                  marginTop: 1,
                  padding: 3,
                  zIndex: 1,
                  backgroundColor: "#ffff",
                  borderRadius: 2,
                }}
              >
                {/* {mode1 !== "editProject" && ( */}
                <div className="attendanceNewContainer">
                  <MDBCol>
                    <MDBInput
                      required
                      // value={formData.sSite}
                      id="form6Example3"
                      label="Name"
                      name="sRoleName"
                      value={formData.sRoleName}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </MDBCol>




                  <div style={customFormGroupStyle}>
                    <Typography sx={{ fontSize: '16px', paddingBottom: '10px' }}>
                      Screens
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', }} >
                      <input
                        placeholder="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ width: '100px', height: '20px', fontSize: '10px', }} // Adjust width and height as needed
                        sx={{ paddingBottom: '50px', }} // sx prop for further customization
                      />

                      {/* Select All Checkbox */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedCompanies.length === company.length}
                            onChange={handleSelectAll}
                            name="select-all"
                            style={{ fontSize: '9px', marginLeft: "25px" }}
                          />
                        }
                        label="Select All"
                      />
                    </div>

                    {/* <div style={customFormGroupStyle}> */}
                    <FormGroup >

                      {company
                        .filter((companyItem) =>
                          companyItem.sName.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((companyItem) => (
                          <FormControlLabel
                            key={companyItem.iId}
                            control={
                              <Checkbox
                                checked={Array.isArray(selectedCompanies) && selectedCompanies.includes(companyItem.iId)}
                                onChange={() => handleItemToggle(companyItem.iId)}
                                name={companyItem.sName}
                                // value={selectedCompanies.companyItem}
                                sx={{ height: "10px" }}

                              />
                            }
                            label={companyItem.sName}
                          />
                        ))}

                    </FormGroup>
                    {/* </div> */}
                  </div>





                </div>
                {/* )} */}
              </Box>
            </div>
          </div>
        </div >

      </Zoom >
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />

    </div >
  )
}

