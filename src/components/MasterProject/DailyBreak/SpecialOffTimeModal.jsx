import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography, Zoom } from "@mui/material";
import { MDBRow, MDBCol, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import Loader from "../../Loader/Loader";
import { GetDailyBreakTypes, GetPayGroupList, GetDailyBreakDetails, PostDailyBreak } from "../../../api/projectApi";
import SearchBoxBreakPoint from "./SearchBoxBreakPoint";
import SearchBoxBreakPoint1 from "./SearchBoxBreakPoint1";



export default function SpecialOffTimeModal({
  isOpen,
  data,
  handleCloseModal,
  handleSubmit,
  actions
}) {

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const iUser = Number(localStorage.getItem("userId"));

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [halfDay, setHalfDay] = useState("");
  const [dayLimit, setDayLimit] = useState("");
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [select, setSelect] = useState([]);
  const [child, setChild] = useState(null);
  const [formData, setFormData] = useState({iUser:iUser,iId:0,iBreakType:null,iFromDate:getCurrentDate(),iTodate:getCurrentDate(),fhour:null,
    BreakDetails:[{iPayGroup:0}]});
  const [breakType, setbreakType] = useState([])
  const [payGroup, setpayGroup] = useState([])
  const [changesTriggered, setchangesTriggered] = useState(false);
  const [userPayGroupDetail, setuserPayGroupDetail] = useState([])

 

  const resetChangesTrigger = () => {
    setchangesTriggered(false);
  };
  const handleSelectedIds = useCallback(
    (selectedIds, params, selectedTitles) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [params]: selectedIds.map(id => ({ iPayGroup: id })), // map to array of objects
      }));
    },
    []
  );
  const payGroupSearch = useMemo(
    () => (
      <SearchBoxBreakPoint1
        initialItems={payGroup}
        search={true}
        handleSelectedIds={handleSelectedIds}
        params={"BreakDetails"}
        changeTriggered={changesTriggered}
      setchangesTriggered={resetChangesTrigger}
      initialCheckedIds={userPayGroupDetail}
      />
    ),
    [payGroup, handleSelectedIds,changesTriggered,userPayGroupDetail]
  );

  useEffect(() => {

    const fetchData = async()=>{
      try {

        const response1 = await GetDailyBreakTypes()
        if(response1?.ResultData && !response1.ResultData== "")
          {
            const data = JSON.parse(response1?.ResultData);
            setbreakType(data);
          }
        else{
          setbreakType([]);
        }
        
        const response2 = await GetPayGroupList()
        if(response2?.ResultData && !response2.ResultData== "")
          {
            const data = JSON.parse(response2.ResultData);
            const transformedData = data.map(item => ({
              title: item.sName,
              iId: item.iId
            }));
            setpayGroup(transformedData);
          }
        else{
          setpayGroup([]);
        }
        
        
      } catch (error) {
        
      }
    }
    
    fetchData()
  }, [])
  
  
  const handleDateChange = (field, value) => {

    
    
    setFormData({
      ...formData,
      [field]: value,
    });
  
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

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  

  const fetchData = async () => {
    handleOpen();
    if (data !== 0) {
      const response = await GetDailyBreakDetails({ iId: data });
      
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setId(data);
        
        const Table = myObject?.Table[0]
        const iPayGroupArray = myObject?.Table1?.map(item => ({ iPayGroup: item.iPayGroup })) || [];
        const initialCheckedIds = myObject.Table1.map(item => item.iPayGroup);
        setuserPayGroupDetail(initialCheckedIds)
        
        const data1= {
          ...formData,
          iId:Table.iId,
          iBreakType:Table.iBreakType,
          iFromDate:Table.iFromDate,
          iTodate:Table.iToDate,
          fhour:Table.fHour,
          BreakDetails:iPayGroupArray,
          sStartingTime:Table?.sStartingTime??" ",
          sEndingTime:Table?.sEndingTime??" "



        }
       
        setFormData(data1)
      }
    } else {
      handleClear();
    }
    handleClose();
  };

  useEffect(() => {
    fetchData();
  }, [data, isOpen]);

  const buttonStyle = {
    textTransform: "none",
    color: `${buttonColors}`,
    backgroundColor: `${secondaryColorTheme}`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const handleClear = () => {
   const data = {iUser:iUser,iId:0,iBreakType:null,iFromDate:getCurrentDate(),iTodate:getCurrentDate(),fhour:null,
    BreakDetails:[{iPayGroup:0}]}
    setFormData(data)
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = () => {
    const fromDate = new Date(formData.iFromDate);
    const toDate = new Date(formData.iTodate);
    const timeDiff = toDate.getTime() - fromDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    // Calculate hours difference between sStartingTime and sEndingTime
  const calculateTimeDifference = () => {
    const timeStringToDate = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const time = new Date();
      time.setHours(hours, minutes, 0, 0);
      return time;
    };

    const startTime = formData.sStartingTime ? timeStringToDate(formData.sStartingTime) : null;
    const endTime = formData.sEndingTime ? timeStringToDate(formData.sEndingTime) : null;

    if (startTime && endTime) {
      return (endTime - startTime) / (1000 * 60 * 60); // Difference in hours
    }
    return 0;
  };

  const maxHours = calculateTimeDifference();
  const roundedFHours = parseFloat(formData.fhour.toFixed(2)); 


    if (!formData.BreakDetails.length>0) {
      Swal.fire({
        title: "Error!",
        text: "Please Select PayGroup",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }

    if (!formData.iBreakType) {
      Swal.fire({
        title: "Error!",
        text: "Please Select Type",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }

    if (!formData.iFromDate || !formData.iTodate) {
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
    if (!formData.fhour) {
      Swal.fire({
        title: "Error!",
        text: "Please Enter Hour",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }
    if (formData.sStartingTime && formData.sEndingTime) {
      if (formData.sStartingTime > formData.sEndingTime) {
      Swal.fire({
        title: "Error!",
        text: "StartTime Can't be greater than EndTime",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
      }
      else if (roundedFHours  > maxHours) {
        Swal.fire({
          title: "Error!",
          text: `Entered hours (${formData.fhour}) exceed the time span between start and end time (${maxHours.toFixed(2)} hours).`,
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      
    }
    if (formData.fhour<0) {
      Swal.fire({
        title: "Error!",
        text: "Please Enter Valid Hour",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop execution if the date range is invalid
    }
   
    let updatedFormdata = {...formData};
    if (!formData.sStartingTime || !formData.sEndingTime ){

        updatedFormdata = {
          ...formData,sStartingTime:"",sEndingTime:""
        }

    }

    
    
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Save this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await PostDailyBreak(updatedFormdata);
       
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Saved",
            text: "Your file has been Saved!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            handleSubmit();
            handleAllClear();
          });
        }else{
          setMessage(response?.MessageDescription? response?.MessageDescription : "Something went wrong" )
          handleOpenAlert()
        }
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  // useEffect(() => {
  //   if (formData.sStartingTime && formData.sEndingTime && formData.sStartingTime !=" " && formData.sEndingTime !=" ") {
  //     const start = new Date(`1970-01-01T${formData.sStartingTime}:00`);
  //     const end = new Date(`1970-01-01T${formData.sEndingTime}:00`);
  //     const diff = (end - start) / (1000 * 60 * 60); // Difference in hours
  //     setFormData(prevFormData => ({
  //       ...prevFormData,
  //       fhour: diff >= 0 ? diff : null
  //     }));
  //   }
  // }, [formData.sStartingTime, formData.sEndingTime]);

  // const handleTimeChange = (e,field) =>{
  //   console.log(e.target.value,field);
  //   const value = e.target.value;
  //   const startTime = formData.sStartingTime
  //   const endTime =  formData.sEndingTime
  //   if(field == "sStartingTime"){console.log("sStartingTime");
  //     const hrs =( (endTime - value) / (1000 * 60 * 60)); // Difference in hours
  //     console.log(hrs,endTime,value);
  //     setFormData({...formData,sStartingTime:value,fHour:hrs})
  //   }
  //   else if(field == "sEndingTime"){
  //     const hrs = (value - startTime)/ (1000 * 60 * 60); // Difference in hours
  //     setFormData({...formData,sEndingTime:value,fHour:hrs})
  //   }

  // }
  const handleTimeChange = (e, field) => {
    const value = e.target.value;
  
    // Updating the time immediately on change
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value
    }));
  };
  
  const calculateHours = () => {
    // Helper function to convert time string "hh:mm" to a Date object.
    const timeStringToDate = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const time = new Date();
      time.setHours(hours, minutes, 0, 0); // Set hours and minutes, seconds and milliseconds to 0.
      return time;
    };
  
    const startTime = formData.sStartingTime ? timeStringToDate(formData.sStartingTime) : null;
    const endTime = formData.sEndingTime ? timeStringToDate(formData.sEndingTime) : null;
  
    if (startTime && endTime) {
      const hrs = (endTime - startTime) / (1000 * 60 * 60);
      const roundedHours = parseFloat(hrs.toFixed(2)); // Round to two decimal places and convert back to float
      setFormData(prevFormData => ({
        ...prevFormData,
        fhour: roundedHours
      }));
    }
  };
  
  // Adjusted onBlur handler to calculate hours
  const handleBlur = (field) => {
    if (field === "sStartingTime" || field === "sEndingTime") {
      calculateHours();
    }
  };

 
  const renderButton = (actionId, label, onClick, icon, disabled = false, style = buttonStyle) => {
    return actions.some(action => action.iActionId === actionId) ? (
      <Button
        onClick={onClick}
        variant="contained"
        disabled={disabled}
        startIcon={icon}
        style={buttonStyle}
      >
        {label}
      </Button>
    ) : null;
  };
  

  return (
    <div>
      <div
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
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <form>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-end"
                >
                  
                  {renderButton(8, "Save",handleSave, <SaveIcon />,  )}
                  <Button
                    onClick={handleAllClear}
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
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <div
                        style={{
                          width: "auto",
                          flexDirection: "column",
                          height: "335px",
                          overflowY: "hidden",

                          border: "1px solid #969999",
                          padding: "0 10px",
                          boxSizing: "border-box",
                          borderRadius: 5,
                        }}
                      >
                        <Typography>PayGroup</Typography>

                        {payGroupSearch}
                      </div>
                    </MDBCol>
                    <MDBCol>
                      <MDBRow className="mb-4">
                        <MDBCol>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                          >
                            <InputLabel id="type-select-label">Type</InputLabel>
                            <Select
                              labelId="type-select-label"
                              id="type-select"
                              value={formData.iBreakType || ""}
                              label="Type"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  iBreakType: e.target.value,
                                })
                              }
                              sx={{
                                width: "100%",
                                height: "37px",
                                fontSize: "14px",
                                ".MuiSelect-select": {
                                  // This targets the selected value area
                                  textAlign: "left",
                                  paddingLeft: "12px", // Adjust the padding as needed
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    "& .MuiMenuItem-root": {
                                      fontSize: "0.875rem", // smaller font size
                                      padding: "4px 8px", // reduced padding
                                    },
                                  },
                                },
                              }}
                            >
                              {breakType.map((type) => (
                                <MenuItem key={type.iId} value={type.iId}>
                                  {type.sName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className="mb-4">
                        <MDBCol>
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="date"
                            size="small"
                            label="From Date"
                            value={formData.iFromDate}
                            onChange={(e) =>
                              handleDateChange("iFromDate", e.target.value)
                            }
                            labelStyle={{
                              fontSize: "15px",
                            }}
                            onKeyDown={(e) => e.preventDefault()}
                            onClick={(e) => e.target.showPicker?.()}
                            onFocus={(e) => e.target.showPicker?.()}
                          />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className="mb-4">
                        <MDBCol>
                          <MDBInput
                            required
                            id={`form3Example`}
                            type="date"
                            size="small"
                            label="To Date"
                            value={formData.iTodate}
                            onChange={(e) =>
                              handleDateChange("iTodate", e.target.value)
                            }
                            labelStyle={{
                              fontSize: "15px",
                            }}
                            onKeyDown={(e) => e.preventDefault()}
                            onClick={(e) => e.target.showPicker?.()}
                            onFocus={(e) => e.target.showPicker?.()}
                          />
                        </MDBCol>
                      </MDBRow>

                      <MDBRow className="mb-4">
                        <MDBCol>
                          <MDBInput
                            value={formData.sStartingTime || " "}
                            id="form6Example3"
                            label="Start Time"
                            type="time"
                            onChange={(e) =>
                              handleTimeChange(e, "sStartingTime")
                            }
                            onBlur={() => handleBlur("sStartingTime")}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                            autoComplete="off"
                            style={{
                              cursor: "text",
                              color: "inherit",
                              backgroundColor: "transparent",
                              border: "none",
                              borderBottom: "1px solid #ced4da",
                            }}
                          />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className="mb-4">
                        <MDBCol>
                          <MDBInput
                            value={formData.sEndingTime || " "}
                            id="form6Example3"
                            label="End Time"
                            type="time"
                            onChange={(e) => handleTimeChange(e, "sEndingTime")}
                            onBlur={() => handleBlur("sEndingTime")}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                            autoComplete="off"
                            style={{
                              cursor: "text",
                              color: "inherit",
                              backgroundColor: "transparent",
                              border: "none",
                              borderBottom: "1px solid #ced4da",
                            }}
                          />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className="mb-4">
                        <MDBCol>
                          <MDBInput
                            value={formData.fhour?.toString() ?? ""}
                            id="form6Example3"
                            label="Hours"
                            type="number"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value); // Convert input to float
                              if (!isNaN(value) && value >= 0) {
                                const roundedValue = parseFloat(value.toFixed(2)); // Round to two decimal points
                                setFormData({
                                  ...formData,
                                  fhour: roundedValue
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  fhour: null
                                });
                              }
                            }}
                            labelStyle={{
                              fontSize: "15px",
                            }}
                            autoComplete="off"
                            style={{
                              cursor: "text",
                              color: "inherit",
                              backgroundColor: "transparent",
                              border: "none",
                              borderBottom: "1px solid #ced4da",
                            }}
                          />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                </Box>
              </form>
            </div>
          </div>
        </div>
      </Zoom>

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </div>
  );
}
