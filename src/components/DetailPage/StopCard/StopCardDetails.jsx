import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBTextArea,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import {
  deleteSummary,
  getDetails,
  getEmployee,
  getPrev_NextDocNo,
  getProject,
  postStopCard,
} from "../../../api/apiCall";
import AutoComplete from "../../AutoComplete/AutoComplete";
import Loader from "../../Loader/Loader";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AutoComplete2 from "../../AutoComplete/AutoComplete2";
import { styled } from "@mui/system";
import ImageModal from "../ImageViewer";

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

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const readOnlyStyle = {
  cursor: "text",
  color: "inherit",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid #ced4da",
};

export default function StopCardDetails({ id, action, apiName, actions }) {
  const [open, setOpen] = React.useState(false);
  const iUser = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";
  const [type, setType] = useState(0);
  const [project, setProject] = useState();
  const [projectCode, setProjectCode] = useState("");
  const [projectDes, setProjectDes] = useState();
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("");
  const [observation, setObservation] = useState("");
  const [corrective, setCorrective] = useState("");
  const [observer, setObserver] = useState();
  const [employeeCode, setEmployeeCode] = useState();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [transId, setTransId] = useState(id);
  const [testUser, setTestUser] = useState(0);
  const [docNo, setDocNo] = useState("");
  const locations = useLocation();
  const details = locations?.state;

  const suggestionType = [
    { iId: 1, sName: "Stop Card" },
    { iId: 2, sName: "Near MIss" },
  ];
  const handleImageClick = (index, types) => {
    setType(types);
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseImagePopup = () => {
    setSelectedImageIndex(null);
    setIsImageModalOpen(false);
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
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          const result = suggestionType.find(
            (item) => item.iId === myObject?.iType
          );
          setDocNo(myObject?.sDocNo);
          setType(result);
          setProject({ sName: myObject?.Project, iId: myObject?.iProject });
          setProjectCode(myObject?.sProjectCode);
          setLocation(myObject?.sLocation);
          setActivity(myObject?.sActivity);
          setObserver({
            iId: myObject?.iObserver,
            sName: myObject?.Observer,
            sCode: myObject?.ObserverCode,
          });
          setEmployeeCode(myObject?.ObserverCode);
          setObservation(myObject?.sObservation);
          setCorrective(myObject?.sCorrectiveAction);
          setTransId(myObject?.iTransId);
          setTestUser(myObject?.iUser);
          if (myObject?.imageFiles?.length) {
            setSelectedFiles(myObject?.imageFiles);
          } else {
            setSelectedFiles([]);
          }
          if (myObject?.sImages) {
            const imageArray = myObject?.sImages.split(";");
            const fullImagePathArray = imageArray.map(
              (image) => `${myObject?.sPath}${image}`
            );
            setSelectedImage(fullImagePathArray);
          }else{
            setSelectedImage([]);
          }
        }
      } else {
        handleClear();
      }
      handleClose();
    };
    fetchData();
  }, [transId]);

  useEffect(() => {
    if (project?.sCode) {
      setProjectCode(project?.sCode);
    }
  }, [project]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
  
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...filesArray];
      
      // Ensure no duplicate files by checking names
      const uniqueFiles = newFiles.filter((file, index, self) =>
        index === self.findIndex((f) => f.name === file.name)
      );
      
      return uniqueFiles;
    });
  
    // Reset the file input value to allow re-selection of the same file
    e.target.value = null;
  };


  const handleSave = async (e) => {
    e.preventDefault();

      let fileNames = "";
      let pathUrl = "";

      if (selectedImage && selectedImage.length) {
        fileNames = selectedImage
          .map((url) => url.substring(url.lastIndexOf("/") + 1))
          .join(";");

        const baseUrl = new URL(selectedImage[0]);
        baseUrl.pathname = baseUrl.pathname.substring(
          0,
          baseUrl.pathname.lastIndexOf("/") + 1
        );
        pathUrl = baseUrl.href;
      }
      const filenames = selectedFiles?.map((file) => file.name);
      const filenamesString = filenames?.join(";");
      const newFileName =
        fileNames +
        (fileNames && filenamesString
          ? ";" + filenamesString
          : filenamesString);
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because month index starts from 0
      const day = String(currentDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      const updatedData = {
        iTransId: transId,
        Project: project?.iId,
        ProjectCode: projectCode,
        Location: location,
        UserId: iUser,
        Activity: activity,
        CorrectiveAction: corrective,
        Observation: observation,
        iObserver: observer?.iId,
        Images: newFileName,
        iType: type?.iId,
        DocDate: formattedDate,
      };
      const formData = new FormData();

      formData.append("data", JSON.stringify(updatedData));

      if (selectedFiles && selectedFiles.length) {
        selectedFiles.forEach((file, index) => {
          formData.append(`imageFiles[${index}]`, file);
        });
      }

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
            const response = await postStopCard(formData);
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

  const handleRemoveImage1 = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  const handleRemoveImage2 = (index) => {
    setSelectedImage((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleClear = async () => {
    handleOpen();
    const response = await getPrev_NextDocNo({
      iTransId: 0,
      iType: 3,
      iForm: 3,
      iUser
    });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setDocNo(myObject[0]?.sDocNo);
    }
    setType("");
    setProject("");
    setProjectCode("");
    setLocation("");
    setActivity("");
    setObserver("");
    setObservation("");
    setCorrective("");
    setTransId(0);
    setSelectedFiles([]);
    setSelectedImage([]);
    setTestUser(iUser);
    handleClose();
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
              text: response?.MessageDescription? response?.MessageDescription : "Somthing went erong",
              confirmButtonColor: "#3085d6",
            });
          }
        }
      });

  };

  const handlePages = async (iType, iTransId) => {
    handleOpen();
    const response = await getPrev_NextDocNo({ iTransId, iType, iForm: 3, iUser });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setTransId(myObject[0]?.iTransId);
    } else {
      setTransId(0);
    }
    handleClose();
  };

  const HtmlTooltip = styled((props) => (
    <Tooltip {...props} classes={{ popper: props.className }} />
  ))({
    tooltip: {
      backgroundColor: "#f5f5f9",
      maxWidth: "auto",
    },
  });

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
            </AccordionSummary>
            <AccordionDetails style={{ padding: 0, margin: 0 }}>
              <MDBCardBody style={{ paddingBottom: 0 }}>
                <MDBRow>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <Autocomplete
                        id={`size-small-filled-assetType`}
                        size="small"
                        value={type || ""}
                        onChange={(event, newValue) => {
                          setType(newValue);
                        }}
                        options={suggestionType.map((data) => ({
                          sName: data?.sName,
                          iId: data?.iId,
                        }))}
                        filterOptions={(options, { inputValue }) => {
                          return options.filter((option) =>
                            option.sName
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          );
                        }}
                        autoHighlight
                        getOptionLabel={(option) =>
                          option && option.sName ? option.sName : ""
                        }
                        renderOption={(props, option) => (
                          <li {...props}>
                            <div
                              className=""
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography
                                style={{
                                  marginRight: "auto",
                                  fontSize: "12px",
                                  fontWeight: "normal",
                                }}
                              >
                                {option.sName}
                              </Typography>
                            </div>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            readonly={iUser !== testUser}
                            required
                            label="Type"
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "off",
                              style: {
                                borderWidth: "1px",
                                borderColor: "#ddd",
                                borderRadius: "10px",
                                fontSize: "15px",
                                height: "20px",
                                paddingLeft: "6px",
                              },
                            }}
                          />
                        )}
                        style={{ width: `auto` }}
                      />
                    </div>
                  </MDBCol>

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
                        label="Project Code *"
                        value={projectCode}
                        onChange={(e) => setProjectCode(e.target.value)}
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
                        label="Location *"
                        autoComplete="off"
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
                        autoComplete="off"
                        label="Activity *"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
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
                        value={observer}
                        setValue={setObserver}
                        apiName={getEmployee}
                        setValue2={setEmployeeCode}
                        field="Observer"
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
                        label="Employee Code *"
                        value={employeeCode}
                        onChange={(e) => setEmployeeCode(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </div>
                  </MDBCol>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <MDBTextArea
                        required
                        id={`form3Example`}
                        type="text"
                        autoComplete="off"
                        label="Observation *"
                        size="small"
                        rows={2}
                        onChange={(e) => setObservation(e.target.value)}
                        value={observation}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </div>
                  </MDBCol>
                  <MDBCol lg="3" md="4" sm="6" xs="12">
                    <div className="mb-3">
                      <MDBTextArea
                        required
                        id={`form3Example`}
                        type="text"
                        autoComplete="off"
                        label="Corrective Action *"
                        size="small"
                        rows={2}
                        onChange={(e) => setCorrective(e.target.value)}
                        value={corrective}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </div>
                  </MDBCol>
                  <>
                    {selectedImage.map((file, index) => (
                      <HtmlTooltip
                        key={index}
                        title={
                          <React.Fragment>
                            <Tooltip title="Remove">
                              <IconButton
                                onClick={() => handleRemoveImage2(index)}
                                size="small"
                                style={{
                                  color: `${buttonColors}`,
                                  backgroundColor: `${secondaryColorTheme}`,
                                  marginRight: 2,
                                }}
                              >
                                <DeleteIcon style={{ fontSize: "16px" }} />
                              </IconButton>
                            </Tooltip>
                          </React.Fragment>
                        }
                      >
                        <MDBCol xl="1" lg="3" md="3" sm="6" xs="12">
                          <img
                            onClick={() => handleImageClick(index, 2)}
                            key={index}
                            src={file}
                            alt={`uploaded-${index}`}
                            style={{
                              height: "70px",
                              width: "70px",
                              cursor: "pointer",
                            }}
                          />
                        </MDBCol>
                      </HtmlTooltip>
                    ))}
                    {selectedFiles.map((file, index) => (
                      <HtmlTooltip
                        key={index}
                        title={
                          <React.Fragment>
                            <Tooltip title="Remove">
                              <IconButton
                                onClick={() => handleRemoveImage1(index)}
                                size="small"
                                style={{
                                  color: `${buttonColors}`,
                                  backgroundColor: `${secondaryColorTheme}`,
                                  marginRight: 2,
                                }}
                              >
                                <DeleteIcon style={{ fontSize: "16px" }} />
                              </IconButton>
                            </Tooltip>
                          </React.Fragment>
                        }
                      >
                        <MDBCol xl="1" lg="2" md="3" sm="4" xs="5">
                          <img
                            key={index}
                            onClick={() => handleImageClick(index, 1)}
                            src={URL.createObjectURL(file)}
                            alt={`uploaded-${index}`}
                            style={{
                              height: "70px",
                              width: "70px",
                              cursor: "pointer",
                            }}
                          />
                        </MDBCol>
                      </HtmlTooltip>
                    ))}
                  </>
                  <MDBCol xl="1" lg="2" md="3" sm="4" xs="5">
                    <div className="mb-3">
                      <div
                        className="file-upload-container"
                        style={{
                          textAlign: "center",
                          border: "3px dashed rgb(210, 227, 244)",
                          padding: "0.2rem",
                          position: "relative",
                          cursor: "pointer",
                          borderRadius: 10,
                          height: "70px",
                          width: "70px",
                        }}
                      >
                        <Button component="label">
                          <div>
                            <AddAPhotoIcon style={{ color: "#adacac" }} />
                            <h3
                              style={{
                                fontSize: "0.6rem",
                                color: "#adacac",
                              }}
                            >
                              Upload Image
                            </h3>
                          </div>
                          <VisuallyHiddenInput
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e)}
                          />
                        </Button>
                      </div>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </AccordionDetails>
          </Accordion>
        </MDBCard>

        <Loader open={open} handleClose={handleClose} />
        <ImageModal
          isOpen={isImageModalOpen}
          imageUrl={
            type === 1 && selectedFiles[selectedImageIndex]
              ? URL.createObjectURL(selectedFiles[selectedImageIndex])
              : selectedImage[selectedImageIndex]
          }
          handleCloseImagePopup={handleCloseImagePopup}
        />
      </form>
    </>
  );
}
