import React, { useEffect, useState } from "react";
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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "../Loader/Loader";
import SaveIcon from "@mui/icons-material/Save";
import { buttonColors, secondaryColorTheme } from "../../config";
import {
  PostHSE,
  crystalPrint,
  deleteSummary,
  getDetails,
  getPrev_NextDocNo,
  getProject,
} from "../../api/apiCall";
import DetailsTable from "./DetailsTable";
import AutoComplete from "../AutoComplete/AutoComplete";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { Details } from "@mui/icons-material";
import ImageModal from "./ImageViewer";
import Swal from "sweetalert2";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

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

export default function DetailPage({ id, action, apiName, actions }) {
  const [body, setBody] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [childData, setChildData] = useState([]);
  const iUser = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";
  const [project, setProject] = useState();
  const [projectDes, setProjectDes] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [transId, setTransId] = useState(id);
  const [sign, setSign] = useState("");
  const [docNo, setDocNo] = useState("");
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const locations = useLocation();
  const details = locations?.state;
  const handleCloseImagePopup = () => {
    setIsImageModalOpen(false);
  };
  const handleImageClick = (index) => {
    setIsImageModalOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      if (transId !== 0 && apiName) {
        const response = await getDetails({ iTransId: transId }, apiName);
        if (response.Status === "Success") {
          const myObject = JSON.parse(response.ResultData);
          setBody(myObject.Body);
          setProject(
            {
              sName: myObject?.Header[0]?.Project,
              iId: myObject?.Header[0]?.iProject,
            } || ""
          );
          setProjectDes(myObject?.Header[0]?.sProjectDes || "");
          setLocation(myObject?.Header[0]?.sLocation || "");
          setDate(formatDate(myObject?.Header[0]?.Date) || "");
          setTransId(myObject?.Header[0]?.iTransId || 0);
          setSign(myObject?.Header[0]?.sSignature || "");
          setDocNo(myObject?.Header[0].sDocNo || "");
        }
      } else {
        handleClear();
      }
      handleClose();
    };
    fetchData();
  }, [transId]);

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

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleOpenAlert = () => {
    setWarning(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!childData.length) emptyFields.push("Add General Conditions");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(` ${emptyFields.join(", ")}.`);
      return;
    }

    // Map and transform childData
    const updatedChildData = childData?.map((obj, index) => {
      const filenames = obj?.imageFiles?.map((file) => file.name);
      const filenamesString = filenames?.join(";");

      const updatedObj = {
        ...obj,
        ActionBy: obj.iActionBy,
        ActionReq: obj.sActionReq,
        Observation: obj.sObservation,
        RiskLevel: obj.iRiskLevel,
        Images:
          obj.sImages +
          (obj.sImages && filenamesString
            ? ";" + filenamesString
            : filenamesString), // Add Images property only if filenamesString is not empty
      };

      if (Array.isArray(obj.imageFiles) && obj.imageFiles.length > 0) {
        updatedObj.imageFiles = obj.imageFiles; // Add imageFiles property only if it is not an empty array
      } else {
        delete updatedObj.imageFiles; // Remove imageFiles property if it is an empty array
      }

      return updatedObj;
    });

    const updatedData = {
      DocDate: date,
      Project: project?.iId,
      ProjectDes: projectDes,
      Location: location,
      UserId: iUser,
      iTransId: transId,
      Signature: "",
      Body: updatedChildData,
    };
    // Create FormData
    const formData = new FormData();

    // Append JSON data to FormData
    formData.append("data", JSON.stringify(updatedData));

    // Append files to FormData
    updatedChildData.forEach((obj, index) => {
      if (Array.isArray(obj?.imageFiles) && obj?.imageFiles.length > 0) {
        // If imageFiles is an array of File objects and not empty
        obj.imageFiles.forEach((file, fileIndex) => {
          formData.append(`imageFiles[${index}][${fileIndex}]`, file);
        });
      }
    });
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
          const response = await PostHSE(formData);
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
              title: "Oops...",
              text: "Something went wrong!",
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
      iForm: 1,
      iUser
    });
    if (response.Status === "Success") {
      const myObject = JSON.parse(response.ResultData);
      setDocNo(myObject[0].sDocNo);
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setBody((prevBody) => (prevBody === -1 ? 0 : -1));
    setLocation("");
    setProject("");
    setProjectDes("");
    setDate(formattedDate);

    setSign("");
    setTransId(0);
    handleClose();
  };

  const handleChildData = (data) => {
    setChildData(data);
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
        const response = await deleteSummary(
          {
            iTransId: transId,
            UserId: iUser,
          },
          details?.sName
        );
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
    const response = await getPrev_NextDocNo({ iTransId, iType, iForm: 1 ,iUser});
    if (response.Status === "Success") {
      const myObject = JSON.parse(response.ResultData);
      setTransId(myObject[0]?.iTransId);
    } else {
      setTransId(0);
    }
  };

  const handlePrint = async (id) => {
    const response = await crystalPrint({ iTransId: id, iFormtype: 1 });
    handleOpen();
    if (response.Status === "Success") {
      window.open(response?.ResultData, "_blank");
    } else {
      handleOpenAlert();
      setMessage("Can't Reach");
    }
    handleClose();
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
          className="text-center"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
        >
          <>
            <div>
              <Accordion defaultExpanded sx={{ padding: 0, margin: 0 }}>
                <AccordionSummary
                  sx={{ paddingBottom: 0, marginLeft: 1 }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                        readOnly
                        style={{
                          cursor: "text",
                          color: "inherit",
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: "1px solid #ced4da",
                        }}
                      />
                      {sign ? (
                        <IconButton
                          onClick={handleImageClick}
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
                    </div>
                  </MDBCol>
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0, margin: 0 }}>
                  <MDBCardBody>
                    <MDBRow className="g-2">
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
                            label="Project Details *"
                            maxLength={100}
                            value={projectDes}
                            onChange={(e) => setProjectDes(e.target.value)}
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
                            autoComplete="off"
                            label="Location *"
                            maxLength={80}
                            size="small"
                            onChange={(e) => setLocation(e.target.value)}
                            value={location}
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
                    </MDBRow>
                  </MDBCardBody>
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        </MDBCard>

        <DetailsTable data={body} handleChildData={handleChildData} />

        <Loader open={open} handleClose={handleClose} />
        <ImageModal
          isOpen={isImageModalOpen}
          imageUrl={sign}
          handleCloseImagePopup={handleCloseImagePopup}
        />
      </form>
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </>
  );
}
