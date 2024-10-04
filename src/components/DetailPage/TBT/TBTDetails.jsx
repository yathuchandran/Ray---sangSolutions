import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import {
  crystalPrint,
  deleteSummary,
  getDetails,
  getEmployee,
  getFormData,
  getPrev_NextDocNo,
  getProject,
  postTBT,
  projectDetails,
} from "../../../api/apiCall";
import AutoComplete from "../../AutoComplete/AutoComplete";
import Loader from "../../Loader/Loader";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AutoComplete2 from "../../AutoComplete/AutoComplete2";
import ImageModal from "../ImageViewer";
import TBTTable1 from "./TBTTable1";
import TBTTable2 from "./TBTTable2";
import TBTTable3 from "./TBTTable3";
import TBTTable4 from "./TBTTable4";
import TBTTable5 from "./TBTTable5";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `${secondaryColorTheme}`, // Set text color
  backgroundColor: `${buttonColors}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  margin: 3,
  fontSize: "12px",
  padding: "6px 10px",
};

const buttonStyle2 = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` ${buttonColors}`, // Set text color
  backgroundColor: `${secondaryColorTheme}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  margin: 3,
  padding: "6px 10px",
};

const readOnlyStyle = {
  cursor: "text",
  color: "inherit",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid #ced4da",
};

export default function TBTDetails({ id, action, apiName, actions }) {
  const [body, setBody] = useState(0);
  const [body2, setBody2] = useState(0);
  const [body3, setBody3] = useState(0);
  const [body4, setBody4] = useState(0);
  const [body5, setBody5] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [childData1, setChildData1] = useState([]);
  const [childData2, setChildData2] = useState([]);
  const [childData3, setChildData3] = useState([]);
  const [childData4, setChildData4] = useState([]);
  const [childData5, setChildData5] = useState([]);
  const iUser = localStorage.getItem("userId")? Number(localStorage.getItem("userId")) : ""
  const [project, setProject] = useState();
  const [projectDes, setProjectDes] = useState();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [client, setClient] = useState("");
  const [time, setTime] = useState();
  const [manPower, setManPower] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobDes, setJobDes] = useState("");
  const [tqUsed, setTqUsed] = useState("");
  const [jobStart, setJobStart] = useState("");
  const [jobEnd, setJobEnd] = useState("");
  const [contacted, setContacted] = useState("");
  const [demo, setDemo] = useState();
  const [isImageModalOpenSign, setIsImageModalOpenSign] = useState(false);
  const [transId, setTransId] = useState(id);
  const [sign, setSign] = useState("");
  const [docNo, setDocNo] = useState("");
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const locations = useLocation();
  const details = locations?.state;

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
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

  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      setTime(getCurrentTime());
      if (transId !== 0 && apiName) {
        const response = await getDetails({ iTransId: transId }, apiName);
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setBody(myObject?.Details?.filter((item) => item.iType === 1));
          setBody2(myObject?.Details?.filter((item) => item.iType === 2));
          setBody3(myObject?.Details?.filter((item) => item.iType === 3));
          setBody4(myObject?.HCS);
          setBody5(myObject?.Attendance);
          setDocNo(myObject?.Header[0]?.sDocNo || "");
          setTransId(myObject?.Header[0]?.iTransId || "");
          setProject({
            sName: myObject?.Header[0]?.ProjectName,
            iId: myObject?.Header[0]?.iProject,
            sCode: myObject?.Header[0]?.ProjectCode,
          });
          setLocation(myObject?.Header[0]?.sLocation);
          setDate(formatDate(myObject?.Header[0]?.sDate));
          setSupervisor({
            sName: myObject?.Header[0]?.sSupervisor,
            iId: myObject?.Header[0]?.iSupervisor,
          });
          setContacted({
            sName: myObject?.Header[0]?.sConductedBy,
            iId: myObject?.Header[0]?.iConductedBy,
          });

          setSign(
            `${myObject?.Header[0]?.SignaturePath}${myObject?.Header[0]?.sSignature}` ||
              ""
          );
          setClient(myObject?.Header[0]?.sClient);
          setManPower(myObject?.Header[0]?.iNo_Manpower);
          setJobType(myObject?.Header[0]?.sJobType);
          setJobDes(myObject?.Header[0]?.sJobDescription);
          setTqUsed(myObject?.Header[0]?.sTools_Equipment);
          setJobStart(myObject?.Header[0]?.sStartTime);
          setJobEnd(myObject?.Header[0]?.sEndTime);
        }
      } else {
        handleClear();
      }
      handleClose();
    };
    fetchData();
  }, [transId]);

  useEffect(() => {
    const fetchData = async () => {
      if (project?.iId) {
        handleOpen();
        const response = await projectDetails({ iId: project?.iId });
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setClient(myObject?.Table[0]?.sClient);
        }
        handleClose();
      } else {
        setClient("");
      }
    };
    fetchData();
  }, [project]);

  const getCurrentTime = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (inputDate) => {
    if (!inputDate) return ""; // handle empty date

    const parts = inputDate.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    } else {
      // handle invalid date format
      console.error(`Invalid date format: ${inputDate}`);
      return "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Map and transform childData
    const Details = [...childData1, ...childData2, ...childData3].map(
      (obj, index) => {
        return {
          SlNo: obj.iSLNo,
          Items: obj.iItems,
          Discussed: obj.iDiscussed,
        };
      }
    );
    const hasComplianceZero = Details.some((item) => item.Discussed === "");
    if (hasComplianceZero) {
      handleOpenAlert();
      setMessage(` Ensure complete compliance`);
      return;
    }

    const HCS = childData4.map((obj, index) => {
      return {
        Task: obj.sTask,
        Hazards: obj.sHazards,
        Controls: obj.sControls,
        Responsibilities: obj.sResponsibilities,
      };
    });

    if (childData4.length === 0) {
      handleOpenAlert();
      setMessage(`Add Hazard Control Sheet`);
      return;
    }

    if (childData5.length === 0) {
      handleOpenAlert();
      setMessage(`Add Attendance Sheet`);
      return;
    }
    const Attendance = childData5.map((obj, index) => {
      return {
        Emp: obj.iEmp,
        EmpName: obj.sEmpName,
        Designation: obj.sDesignation,
        Signature: obj.sSignature,
        Company: obj.iCompany,
        SlNo: index + 1,
      };
    });

    let fileSign;
    if (sign) {
      const urlObject = new URL(sign);
      fileSign = urlObject.pathname.split("/").pop();
    } else {
      fileSign = "";
    }
    // // // Create updatedData object
    const updatedData = {
      iTransId: transId,
      Date: date,
      Project: project?.iId,
      Location: location,
      Supervisor: supervisor?.iId,
      No_Manpower: manPower,
      User: iUser,
      JobType: jobType,
      JobDescription: jobDes,
      Tools_Equipment: tqUsed,
      StartTime: jobStart,
      EndTime: jobEnd,
      ConductedBy: contacted.iId,
      Signature: fileSign,
      Details,
      HCS,
      Attendance,
    };
    const formData = new FormData();

    formData.append("data", JSON.stringify(updatedData));

    try {
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
          const response = await postTBT(formData);
          handleClose();
          if (response?.Status === "Success") {
            Swal.fire({
              title: "Saved",
              text: "Your file has been Saved!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              handleClear();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: `${response?.Status}`,
              text: `${response?.MessageDescription}`,
              confirmButtonColor: "#3085d6",
            });
          }
        }
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleClear = async () => {
    handleOpen();
    const response = await getPrev_NextDocNo({
      iTransId: 0,
      iType: 3,
      iForm: 9,
      iUser
    });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setDocNo(myObject[0]?.sDocNo);
    }
    const response2 = await getFormData({ FormId: 9, iType: 1 });
    if (response2?.Status === "Success") {
      const myObject = JSON.parse(response2?.ResultData);
      setBody(myObject);
    }
    const response3 = await getFormData({ FormId: 9, iType: 2 });
    if (response3?.Status === "Success") {
      const myObject = JSON.parse(response3?.ResultData);
      setBody2(myObject);
    }
    const response4 = await getFormData({ FormId: 9, iType: 3 });
    if (response4?.Status === "Success") {
      const myObject = JSON.parse(response4?.ResultData);
      setBody3(myObject);
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    setTransId(0);
    setProject("");
    setLocation("");
    setBody4([]);
    setBody5([]);
    setDate(formattedDate);
    setSupervisor("");
    setContacted("");
    setSign("");
    setClient("");
    setTime(currentTime);
    setManPower("");
    setJobType("");
    setJobDes("");
    setTqUsed("");
    setJobStart("00:00");
    setJobEnd("00:00");
    handleClose();
  };

  const handleChildData = (data, type) => {
    if (type === 1) {
      setChildData1(data);
    } else if (type === 2) {
      setChildData2(data);
    } else if (type === 3) {
      setChildData3(data);
    } else if (type === 4) {
      setChildData4(data);
    } else if (type === 5) {
      setChildData5(data);
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await deleteSummary(
          {
            iTransId: transId,
            UserId: iUser,
          },
          details?.sName
        );
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Deleted",
            text: "Your file has been deleted!",
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
      }
    });
  };

  const handlePages = async (iType, iTransId) => {
    handleOpen();
    const response = await getPrev_NextDocNo({ iTransId, iType, iForm: 9, iUser });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setTransId(myObject[0]?.iTransId);
    } else {
      setTransId(0);
    }
    handleClose();
  };

  const handleImageClickSign = (index) => {
    setIsImageModalOpenSign(true);
  };

  const handleCloseImagePopupSign = () => {
    setIsImageModalOpenSign(false);
  };

  const handlePrint = async (id) => {
    handleOpen();
    const response = await crystalPrint({ iTransId: id, iFormtype: 9 });
    handleClose();
    if (response?.Status === "Success") {
      window.open(response?.ResultData, "_blank");
    } else {
      handleOpenAlert();
      setMessage("Can't Reach");
    }
  };

  const renderButton = (actionId, label, onClick, icon, disabled = false,type, style = buttonStyle) => {
    return actions.some(action => action.iActionId === actionId) ? (
      <Button
        onClick={onClick}
        type={type}
        variant="contained"
        disabled={disabled}
        startIcon={icon}
        style={disabled ? buttonStyle2 : style}
      >
        {label}
      </Button>
    ) : null;
  };


  return (
    <>
      <form onSubmit={handleSave}>
        <Stack
          direction="row"
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
              variant="h6"
              component="h2"
            >
              {details?.sScreen}
            </Typography>
          </Box>
          <Box>
          
            { renderButton(2, "New", handleClear, <AddIcon />)}
      {renderButton(8, "Save",null, <SaveIcon />,null, "submit"  )}
      {renderButton(4, "Delete", handleDelete, <DeleteIcon />, transId === 0 )}
      {renderButton(9, "Prev",()=>handlePages(1, transId), <ArrowCircleLeftIcon />,  )}
      {renderButton(10, "Next", ()=>handlePages(2, transId), <ArrowCircleRightIcon />, )}
      {renderButton(11, "Print", ()=>handlePrint(transId), <PrintIcon />, transId === 0)}
            <Button
              onClick={action}
              variant="contained"
              startIcon={<CloseIcon />}
              style={buttonStyle}
            >
              Close
            </Button>
          </Box>
        </Stack>
        <MDBCard
          className="text-center "
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
        >
          <Accordion defaultExpanded sx={{ padding: 0, margin: 0 }}>
            <AccordionSummary
              sx={{ paddingBottom: 0, marginLeft: 1 }}
              expandIcon={<ExpandMoreIcon />}
            >
              <MDBCol lg="3" md="4" sm="6" xs="12">
                <div>
                  <MDBInput
                    required
                    id={`form3Example`}
                    type="text"
                    size="small"
                    autoComplete="off"
                    label="Document Number"
                    value={docNo}
                    onChange={(e) => setDocNo(e.target.value)}
                    labelStyle={{
                      fontSize: "15px",
                    }}
                    readonly
                    style={readOnlyStyle}
                  />
                </div>
              </MDBCol>
              {sign ? (
                <IconButton
                  onClick={handleImageClickSign}
                  aria-label="signature"
                >
                  <NoteAltIcon
                    style={{
                      textTransform: "none",
                      color: `${secondaryColorTheme}`,
                    }}
                  />
                </IconButton>
              ) : null}
            </AccordionSummary>
            <AccordionDetails style={{ padding: 0, margin: 0 }}>
              <MDBCardBody style={{ paddingBottom: 0 }}>
                <MDBRow>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <AutoComplete
                        apiName={getProject}
                        value={project}
                        onChangeName={setProject}
                        onChangeDes={setProjectDes}
                      />
                    </div>
                  </MDBCol>

                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <MDBInput
                        required
                        id={`form3Example`}
                        type="text"
                        size="small"
                        autoComplete="off"
                        label="Location *"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                        type="text"
                        size="small"
                        label="Client"
                        autoComplete="off"
                        readOnly
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        style={{
                          cursor: "text",
                          color: "inherit",
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: "1px solid #ced4da",
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
                        autoComplete="off"
                        label="Date *"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                        onFocus={(e) => e.target.showPicker?.()}
                      />
                    </div>
                  </MDBCol>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <MDBInput
                        required
                        id={`form3Example`}
                        type="time"
                        size="small"
                        autoComplete="off"
                        label="Time *"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </div>
                  </MDBCol>

                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <AutoComplete2
                        required
                        id="form6Example4"
                        value={supervisor}
                        setValue={setSupervisor}
                        apiName={getEmployee}
                        setValue2={setDemo}
                        field="Supervisor"
                      />
                    </div>
                  </MDBCol>

                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <MDBInput
                        required
                        id={`form3Example`}
                        type="number"
                        size="small"
                        autoComplete="off"
                        label="No.of manpower *"
                        value={manPower}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // Check if the input is a non-negative number (including zero)
                          if (/^\d+$/.test(inputValue) || inputValue === "") {
                            setManPower(inputValue);
                          }
                        }}
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
                        type="text"
                        size="small"
                        autoComplete="off"
                        label="Job type *"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
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
                        type="text"
                        size="small"
                        autoComplete="off"
                        label="Job description *"
                        value={jobDes}
                        onChange={(e) => setJobDes(e.target.value)}
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
                        type="text"
                        size="small"
                        autoComplete="off"
                        label="Tool & Equipment used *"
                        value={tqUsed}
                        onChange={(e) => setTqUsed(e.target.value)}
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
                        type="time"
                        size="small"
                        autoComplete="off"
                        label="Job start time *"
                        value={jobStart}
                        onChange={(e) => setJobStart(e.target.value)}
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
                        type="time"
                        size="small"
                        autoComplete="off"
                        label="Job end time *"
                        value={jobEnd}
                        onChange={(e) => setJobEnd(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </div>
                  </MDBCol>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <AutoComplete2
                        required
                        id="form6Example4"
                        value={contacted}
                        setValue={setContacted}
                        apiName={getEmployee}
                        setValue2={setDemo}
                        field="Conducted By"
                      />
                    </div>
                  </MDBCol>
                  <></>
                </MDBRow>
              </MDBCardBody>
            </AccordionDetails>
          </Accordion>
        </MDBCard>
        <TBTTable1 data={body} handleChildData={handleChildData} />
        <TBTTable2 data={body2} handleChildData={handleChildData} />
        <TBTTable3 data={body3} handleChildData={handleChildData} />
        <TBTTable4 data={body4} handleChildData={handleChildData} />
        <TBTTable5 data={body5} handleChildData={handleChildData} />
        <Loader open={open} handleClose={handleClose} />
      </form>

      <ImageModal
        isOpen={isImageModalOpenSign}
        imageUrl={sign}
        handleCloseImagePopup={handleCloseImagePopupSign}
      />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </>
  );
}
