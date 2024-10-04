import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Stack, Zoom } from "@mui/material";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import { buttonColors, secondaryColorTheme } from "../../../config";
import { getEmpDesignation, getEmployee } from "../../../api/apiCall";
import AutoComplete2 from "../../AutoComplete/AutoComplete2";
import Loader from "../../Loader/Loader";
import AutoComplete3 from "../../AutoComplete/AutoComplete3";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

export default function TBTTable5Modal({
  isOpen,
  data,
  handleCloseModal,
  handleRowData,
  rowIndex,
  allData,
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [transId, setTransId] = useState(0);
  const [SignaturePath, setSignaturePath] = useState("");
  const [sSignature, setSignature] = useState("");
  const [open, setOpen] = React.useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [condition, setCondition] = useState(false);
  const [newName, setNewName] = useState("")
  const [newRowIndex, setNewRowIndex] = useState(0)

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };
  useEffect(() => {
    handleOpen();
    if (data && Object.keys(data).length > 0) {
      setNewRowIndex(rowIndex)
      setTransId(data?.iTransId);
      setCode(data?.sEmpCode);
      setName({
        sName: data?.sEmpName,
        sCode: data?.sEmpCode,
        iId: data?.iEmp,
      });
      setCompany({
        sName: data?.sCompany,
        iId: data?.iCompany,
      });
      setDesignation(data?.sDesignation);
      setSignature(data?.sSignature);
      setSignaturePath(data?.SignaturePath);
    } else {
      handleClear();
    }
    handleClose();
  }, [data, isOpen]);

  const buttonStyle = {
    textTransform: "none",
    color: `${buttonColors}`,
    backgroundColor: `${secondaryColorTheme}`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const handleClear = () => {
    setNewRowIndex(-1)
    setTransId(0);
    setCode("");
    setName("");
    setCompany("");
    setDesignation("");
    setSignature("");
    setSignaturePath("");
    setNewName("")
    setCondition(false)
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const handleSave = (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!name) emptyFields.push("Employee Name");
    if (!code) emptyFields.push("Employee Code");
    if (!company) emptyFields.push("Company");
    if (!designation) emptyFields.push("Designation");

    if(name?.iId === 2552){
      if (!newName) emptyFields.push("Employee Name");
    }

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(
        `Please fill in the following mandatory fields: ${emptyFields.join(
          ", "
        )}.`
      );
      return;
    }

    const saveData = {
      iTransId: transId,
      sEmpName: name?.iId === 2552 ? newName : name?.sName,
      iEmp: name?.iId,
      sEmpCode: code,
      sCompany: company?.sName,
      iCompany: company?.iId,
      sDesignation: designation,
      sSignature,
      SignaturePath,
    };
    handleRowData(saveData, newRowIndex);
    handleAllClear();
  };

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
      if (name?.iId && !designation) {
        setCondition(false);
        if (name?.iId === 2552) {
          setCondition(true);
          const response = await getEmpDesignation({ iEmployee: name?.iId });
          if (response.Status === "Success") {
            const myObject = JSON.parse(response.ResultData);
            setDesignation(myObject[0]?.sDesignation);
          }
        } else {
          setCondition(false);
          const isMatchFound = allData.some((item) => item.iEmp === name?.iId);
          if (!isMatchFound || transId !== 0) {
            const response = await getEmpDesignation({ iEmployee: name?.iId });
            if (response.Status === "Success") {
              const myObject = JSON.parse(response.ResultData);
              setDesignation(myObject[0]?.sDesignation);
            }
          } else {
            setMessage("Already this Employee has been Selected");
            handleOpenAlert();
            setName("");
            setCode("");
            setDesignation("");
            setNewName("")
          }
        }
      }
    };
    fetchData();
  }, [name]);

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
                  <Button
                    onClick={handleClear}
                    variant="contained"
                    startIcon={<AddIcon />}
                    style={buttonStyle}
                  >
                    New
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    style={buttonStyle}
                  >
                    Save
                  </Button>
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
                      <AutoComplete2
                        required
                        id="form6Example4"
                        value={name}
                        setValue={setName}
                        apiName={getEmployee}
                        setValue2={setCode}
                        field="Employee Name"
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={code}
                        id="form6Example3"
                        autoComplete="off"
                        label="Employee Code *"
                        onChange={(e) => setCode(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <AutoComplete3
                        label="Company"
                        value={company}
                        onChangeName={setCompany}
                        employeeDet={name}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={designation}
                        id="form6Example3"
                        autoComplete="off"
                        label="Designation *"
                        onChange={(e) => setDesignation(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                      />
                    </MDBCol>
                  </MDBRow>
                  {condition ? (
                    <MDBRow className="mb-4">
                      <MDBCol>
                        <MDBInput
                          required
                          value={newName}
                          id="form6Example3"
                          autoComplete="off"
                          label="Employee Name *"
                          onChange={(e) => setNewName(e.target.value)}
                          labelStyle={{
                            fontSize: "15px",
                          }}
                        />
                      </MDBCol>
                      <MDBCol></MDBCol>
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
