import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../../Loader/Loader";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { buttonColors, secondaryColorTheme } from "../../../config";
import {
  deleteFormData,
  formDataSummary,
  getForms,
  getFormsType,
} from "../../../api/projectApi";
import AutoComplete6 from "../../AutoComplete/AutoComplete6";
import FormDesModal from "./FormDesModal";
import { getActionBasedOnuser } from "../../../api/settingsApi";

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    rows,
    setDisplay,
    display,
  } = props;

  return (
    <TableHead
      style={{
        background: `${secondaryColorTheme}`,
        position: "sticky",
        top: 0,
        zIndex: "5",
      }}
    >
      <TableRow>
        <TableCell
          sx={{
            padding: "4px",
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          padding="checkbox"
        >
          <Checkbox
            color="default"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {rows.map((header, index) => {
          if (header !== "iId" && header !== "totalRows") {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                onClick={() => setDisplay(!display)}
                sx={{
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  color: "white",
                }}
                key={`${index}-${header}`}
                align="left" // Set the alignment to left
                padding="normal"
                sortDirection={orderBy === header ? order : false}
              >
                {header}
              </TableCell>
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    name,
    values,
    changes,
    form,
    setForm,
    formType,
    setFormType,
    loading,
  } = props;

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <div>
        <Typography variant="h6" id="tableTitle" component="div">
          {name} {loading && <CircularIndeterminate />}
        </Typography>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <AutoComplete6
          value={form}
          apiName={getForms}
          setValue={setForm}
          field="Form"
        />

        <div style={{ marginLeft: 10 }}>
          <AutoComplete6
            value={formType}
            apiName={getFormsType}
            setValue={setFormType}
            field="Type"
            payload={{ iForm: form?.iId ? form?.iId : 0 }}
          />
        </div>
        <TextField
          id="search"
          label="Search"
          variant="outlined"
          value={values}
          onChange={changes}
          size="small"
          sx={{ marginLeft: 1 }}
        />
      </div>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function FormDesSummary() {
  const iUser = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";
  const location = useLocation();
  const details = location.state;
  const direction = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [displayStart, setDisplayStart] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [display, setDisplay] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [navigate, setNavigate] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [warning, setWarning] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [form, setForm] = React.useState("");
  const [formType, setFormType] = React.useState("");
  const [loading, setloading] = React.useState(false);
  const [actions, setActions] = React.useState([])

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
  const fetchData = async () => {
    setNavigate(false);
    setloading(true);
    let response = await formDataSummary({
      iForm: form?.iId ? form?.iId : 0,
      iType: formType?.iId ? formType?.iId : 0,
    });
    if (response.Status === "Success") {
      const myObject = JSON.parse(response.ResultData);
      setData(myObject.Table);
    } else {
      setData([]);
    }
    setloading(false);
  };

  React.useEffect(() => {
    fetchData(); // Initial data fetch
    setSearchQuery("");
  }, [details, form, formType]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.iId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (newPage) => {
    setDisplayStart(newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const filteredRows = data.filter((row) =>
    Object.values(row).some((value) => {
      if (typeof value === "string") {
        return value?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (typeof value === "number") {
        return value?.toString().includes(searchQuery.toLowerCase());
      }
      return false; // Ignore other types
    })
  );

  const handleDelete = async () => {
    const ids = selected.join();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        const response = await deleteFormData(
          {
            iId: ids,
            iUser,
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
          });
          setSelected([]);
        } else {
          setMessage(response?.MessageDescription);
          handleOpenAlert();
        }
        fetchData();
      }
    });
  };

  const handleOpenModal = () => {
    setId(0);
    setIsModalOpen(true);
  };

  const handleEdit = async () => {
    setId(selected[0]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    fetchData();
  };

  React.useEffect(() => {
    setFormType("")
  }, [form]);

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

  const renderButton = (
    actionId,
    label,
    onClick,
    icon,
    disabled = false,
    style = buttonStyle
  ) => {
    return actions.some((action) => action.iActionId === actionId) ? (
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

  return (
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
            paddingBottom: 8,
            zIndex: 1,
            minHeight: "590px",
          }}
        >
          <>
            <Stack
              direction="row"
              spacing={1}
              padding={1}
              justifyContent="flex-end"
            >
              
              {renderButton(2, "New", handleOpenModal, <AddIcon />)}
              {renderButton(
                3,
                "Edit",
                handleEdit,
                <EditIcon />,
                selected.length !== 1
              )}
              {renderButton(
                4,
                "Delete",
                handleDelete,
                <DeleteIcon />,
                selected.length !== 1
              )}
              <Button
                onClick={() => direction("/home")}
                variant="contained"
                startIcon={<CloseIcon />}
                style={buttonStyle}
              >
                Close
              </Button>
            </Stack>

            <Paper
              sx={{
                width: "100%",
                mb: 2,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              }}
            >
              <EnhancedTableToolbar
                name={details?.sScreen}
                values={searchQuery}
                changes={handleSearch}
                numSelected={selected.length} // Provide the numSelected prop
                form={form}
                setForm={setForm}
                formType={formType}
                setFormType={setFormType}
                loading={loading}
              />

              {data.length > 0 && (
                <TableContainer
                  style={{
                    display: "block",
                    maxHeight: "calc(100vh - 350px)",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#888 #f5f5f5",
                    scrollbarTrackColor: "#f5f5f5",
                  }}
                >
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <EnhancedTableHead
                      numSelected={Object.keys(selected).length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={data.length}
                      rows={Object.keys(data[0])}
                      setDisplay={setDisplay}
                      display={display}
                    />

                    <TableBody>
                      {filteredRows.map((row, index) => {
                        const isItemSelected = isSelected(row.iId);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        const handleRowDoubleClick = async (event, iId) => {
                          const hasEdit = actions.some(action => action.iActionId === 3);
                          if(hasEdit){
                          setId(iId);
                          setIsModalOpen(true);
                          }
                        };

                        return (
                          <TableRow
                            hover
                            className={`table-row `}
                            onClick={(event) => handleClick(event, row.iId)}
                            onDoubleClick={(event) =>
                              handleRowDoubleClick(event, row.iId)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.iId}
                            selected={isItemSelected}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            {Object.keys(data[0]).map((column, index) => {
                              if (column !== "iId" && column !== "totalRows") {
                                return (
                                  <>
                                    {display ? (
                                      <TableCell
                                        sx={{
                                          padding: "4px",
                                          border: "1px solid #ddd",
                                          whiteSpace: "nowrap",
                                          width: "calc(100% / 4)",
                                        }}
                                        key={row[column]}
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="normal"
                                        align="left"
                                      >
                                        {row[column]}
                                      </TableCell>
                                    ) : (
                                      <TableCell
                                        sx={{
                                          padding: "4px",
                                          border: "1px solid #ddd",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          width: "calc(100% / 4)",
                                          minWidth: "100px",
                                          maxWidth: 150,
                                        }}
                                        key={row[column]}
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="normal"
                                        align="left"
                                      >
                                        {row[column]}
                                      </TableCell>
                                    )}
                                  </>
                                );
                              }
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  display: "flex", // Use flexbox for the container
                  justifyContent: "space-between", // Space between the elements
                  alignItems: "center", // Center the elements vertically
                  ".MuiTablePagination-toolbar": {
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%", // Ensure the toolbar takes the full width
                  },
                  ".MuiTablePagination-spacer": {
                    flex: "1 1 100%", // Force the spacer to take up all available space
                  },
                  ".MuiTablePagination-selectLabel": {
                    margin: 0, // Adjust or remove margin as needed
                  },
                  ".MuiTablePagination-select": {
                    textAlign: "center", // Center the text inside the select input
                  },
                  ".MuiTablePagination-selectIcon": {},
                  ".MuiTablePagination-displayedRows": {
                    textAlign: "left", // Align the "1-4 of 4" text to the left
                    flexShrink: 0, // Prevent the text from shrinking
                    order: -1, // Place it at the beginning
                  },
                  ".MuiTablePagination-actions": {
                    flexShrink: 0, // Prevent the actions from shrinking
                  },
                  // Add other styles as needed
                }}
              />
            </Paper>
          </>
        </Box>
        <Loader open={open} handleClose={handleClose} />
        <FormDesModal
          isOpen={isModalOpen}
          data={id}
          handleCloseModal={handleCloseModal}
          handleSubmit={handleSubmit}
          actions={actions}
        />
        <ErrorMessage
          open={warning}
          handleClose={handleCloseAlert}
          message={message}
        />
      </Box>
      <Footer />
    </>
  );
}

function CircularIndeterminate() {
  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
