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
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../Loader/Loader";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../Header/Header";
import { buttonColors, secondaryColorTheme } from "../../config";
import exportToExcelForm from "../DashBoard/ExcelFunction/ExcelFunction";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import Footer from "../Footer/Footer";
import {
  getEmployeeSummary,
  getProjectDelete,
  refreshEmployee,
} from "../../api/projectApi";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmployeeModal from "./EmployeeModal";
import { createRoot } from "react-dom";
import html2canvas from "html2canvas";
import QRCode from "qrcode.react";
import QrImage from "./QrImage";
import { getActionBasedOnuser } from "../../api/settingsApi";


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

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
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
          if (
            header !== "iId" &&
            header !== "totalRows" &&
            header !== "sDescription" &&
            header !== "iDeleteSts"
          ) {
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
                align={header !== "sBarcode" ? "left" : "center"}
                padding="normal"
                sortDirection={orderBy === header ? order : false}
              >
                {header?.slice(1)}
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
  const { name, values, changes } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {name}
      </Typography>

      <TextField
        id="search"
        label="Search"
        variant="outlined"
        value={values}
        onChange={changes}
        size="small"
      />
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EmployeeSummary() {
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
  const [message, setMessage] = React.useState("");
  const [warning, setWarning] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [loading, setloading] = React.useState(false);
  const [actions, setActions] = React.useState([]);

  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [qrcode, setQrcode] = React.useState("");


  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleEdit = async () => {
    setId(selected[0]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
   setloading(true)
    let response = await getEmployeeSummary({
      DisplayLength: rowsPerPage,
      DisplayStart: displayStart,
      Search: searchQuery,
    });
    setData(response);
  setloading(false)
  };

  React.useEffect(() => {
    fetchData(); // Initial data fetch
  }, [details, rowsPerPage, displayStart, searchQuery]);

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
    setPage(newPage);
    setDisplayStart(newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const filteredRows = data.filter((row) =>
    Object.values(row).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase();
      }
      if (typeof value === "number") {
        return value.toString();
      }
      return false; // Ignore other types
    })
  );


  const handleExcel = async () => {
    const Id = ["iId"];
    handleOpen();
    let response = await getEmployeeSummary({
      DisplayLength: 0,
      DisplayStart: 0,
    });
    handleClose();
    exportToExcelForm(response, Id, details?.sName);
  };

  const handleImageClick = (text) => {
    setQrcode(text);
    setIsImageModalOpen(true);
    setSelected([]);
  };

  const handleCloseImagePopup = () => {
    setQrcode("");
    setIsImageModalOpen(false);
    setSelected([]);
  };

  const handleSubmit = () => {
    fetchData();
  };

  const handleRefresh = async () => {
    const response = await refreshEmployee();
    if (response?.Status === "Success") {
      Swal.fire({
        icon: "success",
        title: `${response?.MessageDescription}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

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
      {renderButton(12, "Refresh", handleRefresh, <RefreshIcon />)} 
      {renderButton(3, "Edit", handleEdit, <EditIcon />, selected.length !== 1)}
      {renderButton(7, "Excel", handleExcel, <PrintIcon />, data.length === 0)}
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
              />

              {data.length > 0 && (
                <TableContainer
                  style={{
                    display: "block",
                    maxHeight: "calc(100vh - 250px)",
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
                              if (
                                column !== "iId" &&
                                column !== "totalRows" &&
                                column !== "sDescription" &&
                                column !== "iDeleteSts"
                              ) {
                                return (
                                  <>
                                    {display ? (
                                      <TableCell
                                        sx={{
                                          padding: "4px",
                                          border: "1px solid #ddd",
                                          whiteSpace: "nowrap",
                                          width: "calc(100% / 5)",
                                        }}
                                        key={row[column]}
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="normal"
                                        align={
                                          column !== "sBarcode"
                                            ? "left"
                                            : "center"
                                        }
                                      >
                                        {column !== "sBarcode" ? (
                                          `${row[column]}`
                                        ) : (
                                          <div>
                                            <IconButton
                                              onClick={() =>
                                                handleImageClick(
                                                  `${row[column]}`
                                                )
                                              }
                                              sx={{ padding: 0, margin: 0 }}
                                            >
                                              <QRCode
                                                id="qr-code"
                                                value={row[column]}
                                                size={10}
                                              />
                                            </IconButton>
                                          </div>
                                        )}
                                      </TableCell>
                                    ) : (
                                      <TableCell
                                        sx={{
                                          padding: "4px",
                                          border: "1px solid #ddd",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          width: "calc(100% / 5)",
                                          minWidth: "100px",
                                          maxWidth: 150,
                                        }}
                                        key={row[column]}
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="normal"
                                        align={
                                          column !== "sBarcode"
                                            ? "left"
                                            : "center"
                                        }
                                      >
                                        {column !== "sBarcode" ? (
                                          `${row[column]}`
                                        ) : (
                                          <div>
                                            <IconButton
                                              onClick={() =>
                                                handleImageClick(
                                                  `${row[column]}`
                                                )
                                              }
                                              sx={{ padding: 0, margin: 0 }}
                                            >
                                              <QRCode
                                                id="qr-code"
                                                value={row[column]}
                                                size={20}
                                              />
                                            </IconButton>
                                          </div>
                                        )}
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
                count={data.length > 0 ? data[0].totalRows : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
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
                    display: "none",
                  },
                  ".MuiTablePagination-select": {
                    textAlign: "center", // Center the text inside the select input
                    display: "none",
                  },
                  ".MuiTablePagination-selectIcon": {
                    display: "none", // Adjust the position of the icon as needed
                  },
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
        <ErrorMessage
          open={warning}
          handleClose={handleCloseAlert}
          message={message}
        />
      </Box>
      <EmployeeModal
        isOpen={isModalOpen}
        data={id}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleSubmit}
        actions={actions}
      />
      <QrImage
        isOpen={isImageModalOpen}
        imageUrl={qrcode}
        handleCloseImagePopup={handleCloseImagePopup}
      />
      {loading && <CircularIndeterminate />}
      <Footer />
    </>
  );
}

const TablePaginationActions = (props) => {
  const { count, page, rowsPerPage, onPageChange } = props;

  // Calculate the last page index
  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  // Generate page numbers: we want to show 2 pages on each side if possible
  const startPage = Math.max(0, page - 2); // Current page - 2, but not less than 0
  const endPage = Math.min(lastPage, page + 2); // Current page + 2, but not more than last page

  // Create an array of page numbers to be shown
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, idx) => startPage + idx
  );

  const handlePageButtonClick = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <div style={{ flexShrink: 0, marginLeft: 20 }}>
      {page > 0 && (
        <IconButton onClick={() => handlePageButtonClick(0)}>
          <FirstPageIcon />
        </IconButton>
      )}
      {pages.map((pageNum) => (
        <IconButton
          sx={{
            minWidth: "30px",
            minHeight: "30px",
            padding: "2px",
            margin: "1px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%", // Make the background round
            color: "inherit",
            backgroundColor: pageNum === page ? "grey" : "white",
            "&:hover": {
              backgroundColor: pageNum === page ? "grey" : "lightgrey", // Change hover color
            },
            "&.Mui-disabled": {
              backgroundColor: "white",
            },
            fontSize: "14px",
          }}
          key={pageNum}
          color={pageNum === page ? "primary" : "default"}
          onClick={() => handlePageButtonClick(pageNum)}
          disabled={pageNum > lastPage}
        >
          {pageNum + 1}
        </IconButton>
      ))}
      {page < lastPage && (
        <IconButton onClick={() => handlePageButtonClick(lastPage)}>
          <LastPageIcon />
        </IconButton>
      )}
    </div>
  );
};

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
