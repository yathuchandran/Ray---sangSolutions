import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Stack, Zoom, styled } from "@mui/material";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Swal from "sweetalert2";
import { buttonColors, secondaryColorTheme } from "../../../config";
import Loader from "../../Loader/Loader";
import {
  formDataDetails,
  getForms,
  getFormsType,
  postFormData,
} from "../../../api/projectApi";
import AutoComplete6 from "../../AutoComplete/AutoComplete6";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fileUpload } from "../../../api/apiCall";

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

export default function FormDesModal({
  isOpen,
  data,
  handleCloseModal,
  handleSubmit,
  actions
}) {
  const [id, setId] = useState(0);
  const [form, setForm] = useState("");
  const [type, setType] = useState("");
  const [slNo, setSlNo] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");

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

  const iUser = Number(localStorage.getItem("userId"));
  const fetchData = async () => {
    handleOpen();
    if (data !== 0) {
      const response = await formDataDetails({ iId: data });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setId(data);
        setForm({
          sName: myObject?.Table[0]?.sForm,
          iId: myObject?.Table[0]?.iForm,
        });
        setType({
          sName: myObject?.Table[0]?.sType,
          iId: myObject?.Table[0]?.iType,
        });
        setSlNo(myObject?.Table[0]?.iSiNo);
        setDescription(myObject?.Table[0]?.sDescription);
        if (myObject?.Table[0]?.sImage) {
          const urlSegments = myObject?.Table[0]?.sImage.split("/");
          const imageName = urlSegments[urlSegments.length - 1];
          setImageName(imageName);
        } else {
          setImageName("");
        }
        setImageUrl(myObject?.Table[0]?.sImage);
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
    setId(0);
    setForm("");
    setType("");
    setSlNo("");
    setDescription("");
    setFile(null);
    setImageUrl("");
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = () => {
    let emptyFields = [];
    if (!form) emptyFields.push("Form");
    if (
      (form?.iId === 5 && !type) ||
      (form?.iId === 6 && !type) ||
      (form?.iId === 9 && !type)
    )
      emptyFields.push("Type");
    if (!slNo) emptyFields.push("Sl No");
    if (!description) emptyFields.push("Description");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(`Please fill : ${emptyFields.join(", ")}.`);
      return;
    }
    const saveData = {
      iId: id,
      iUser,
      iForm: form?.iId,
      iType: type?.iId,
      iSiNo: slNo,
      sDescription: description,
      sImage: imageName,
    };
    let formData = new FormData();
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
        const response = await postFormData(saveData);
        let response2;
        if (file) {
          formData.append("10", 10);
          formData.append(`imageFiles`, file);
          response2 = await fileUpload(formData);
        } else {
          response2 = { Status: "Success" };
        }
        handleClose();
        if (response?.Status === "Success" && response2?.Status === "Success") {
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
        } else {
          setMessage(response?.MessageDescription);
          handleOpenAlert();
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

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setImageName(uploadedFile.name);
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleClearImage = () => {
    setFile(null);
    setImageUrl("");
    setImageName("");
  };

  useEffect(() => {
    if(!form){
      setType("");
    }
  }, [form]);

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
                      <AutoComplete6
                        value={form}
                        apiName={getForms}
                        setValue={setForm}
                        field="Form"
                        required={true}
                      />
                    </MDBCol>
                    <MDBCol>
                      <AutoComplete6
                        value={type}
                        apiName={getFormsType}
                        setValue={setType}
                        field="Type"
                        payload={{ iForm: form?.iId || 0 }}
                        required={
                          form?.iId === 5
                            ? true
                            : form?.iId === 6
                            ? true
                            : form?.iId === 9
                            ? true
                            : false
                        }
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        value={slNo}
                        id="form6Example3"
                        type="number"
                        label="SL.NO *"
                        onChange={(e) => setSlNo(e.target.value)}
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
                    <MDBCol>
                      <MDBInput
                        value={description}
                        id="form6Example3"
                        label="Description *"
                        onChange={(e) => setDescription(e.target.value)}
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
                  {form && form.iId === 9 ? (
                    <MDBRow className="mb-4" style={{ textAlign: "center" }}>
                      {imageUrl && (
                        <div
                          className="mb-2"
                          style={{ display: "inline-block" }}
                        >
                          <img
                            src={imageUrl}
                            alt="Uploaded Image"
                            style={{ maxWidth: "100px", maxHeight: "70px" }}
                          />
                        </div>
                      )}
                      {imageUrl !== "" ? (
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          sx={{ textTransform: "none" }}
                          tabIndex={-1}
                          onClick={handleClearImage}
                        >
                          Clear
                        </Button>
                      ) : (
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          sx={{ textTransform: "none" }}
                          tabIndex={-1}
                        >
                          Choose File
                          <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                          />
                        </Button>
                      )}
                    </MDBRow>
                  ) : null}
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
