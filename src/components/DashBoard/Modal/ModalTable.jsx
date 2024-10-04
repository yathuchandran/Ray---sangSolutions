import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import {
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from "mdb-react-ui-kit";
import PrintIcon from "@mui/icons-material/Print";
import { buttonColors, secondaryColorTheme } from "../../../config";
import exportToExcelForm from "../ExcelFunction/ExcelFunction";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `${buttonColors}`, // Set text color
  backgroundColor: `${secondaryColorTheme}`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,

    onRequestSort,
    rows,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
        {rows.map((header, index) => {
          if (
            header !== "iTransId" &&
            header !== "sNarration" &&
            header !== "sProjectDes" &&
            header !== "sClient" &&
            header !== "Time" &&
            header !== "iType" &&
            header !== "iUser" &&
            header !== "Status" &&
            header !== "sStatus"
          ) {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{ border: "1px solid #ddd" }}
                key={`${index}-${header}`}
                align="left" // Set the alignment to left
                padding="normal"
                sortDirection={orderBy === header ? order : false}
              >
                <TableSortLabel
                  sx={{ color: "#fff" }}
                  active={orderBy === header}
                  direction={orderBy === header ? order : "asc"}
                  onClick={createSortHandler(header)}
                >
                  {header === "sDocNo" || header === "sLocation"
                    ? header?.slice(1)
                    : header}
                  {orderBy === header ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { values, changes } = props;

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
      ></Typography>

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

EnhancedTableToolbar.propTypes = {};

export default function ModalTable({
  isOpen,
  data,
  handleCloseModal,
  status,
  chartType,
  values,
  foundData,
  titleText,
}) {
  const modalStyle = {
    display: isOpen ? "block" : "none",
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tableData, setTableData] = useState([]);

  React.useEffect(() => {
    setTableData(data);
    setSearchQuery("");
    setPage(0);
  }, [data]);

  const filteredRows =
    tableData &&
    tableData.filter((row) =>
      Object.values(row).some((value) => {
        if (typeof value === "string") {
          return value.includes(searchQuery.toLowerCase());
        }
        if (typeof value === "number") {
          return value.toString().includes(searchQuery.toLowerCase());
        }
        return false; // Ignore other types
      })
    );
  const visibleRows = React.useMemo(() => {
    const sortedRows = stableSort(
      filteredRows || [],
      getComparator(order, orderBy)
    );
    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, filteredRows]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleExcel = async () => {
    if (tableData) {
      try {
        const Id = [""];
        exportToExcelForm(
          tableData,
          Id,
          `${foundData.chartName.toUpperCase()}${
            status === 1
              ? " CURRENT MONTH "
              : status === 2
              ? " CURRENT YEAR "
              : status === 3
              ? " TILL DATE "
              : null
          }${titleText}`
        );
      } catch (error) {
        console.error("Error generating Excel:", error);
      }
    }
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
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <MDBModalContent sx={{ maxHeight: "150px" }}>
                <MDBModalHeader>
                  <MDBModalTitle>
                    {/* Conditional title based on 'status' */}
                    {status === 1 && (
                      <h6
                        style={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {foundData.chartName} CURRENT MONTH {titleText}
                      </h6>
                    )}
                    {status === 2 && (
                      <h6
                        style={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {foundData.chartName} CURRENT YEAR {titleText}
                      </h6>
                    )}
                    {status === 3 && (
                      <h6
                        style={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {foundData.chartName} TILL DATE {titleText}
                      </h6>
                    )}
                  </MDBModalTitle>
                  <div className="modal-buttons">
                    <Button
                      onClick={handleExcel}
                      variant="contained"
                      sx={{ mr: 1 }}
                      startIcon={<PrintIcon />}
                      style={buttonStyle}
                    >
                      Excel
                    </Button>
                    <Button
                      onClick={handleCloseModal}
                      variant="contained"
                      startIcon={<CloseIcon />}
                      style={buttonStyle}
                    >
                      Close
                    </Button>
                  </div>
                </MDBModalHeader>
                <MDBModalBody>
                  {values && (values.sProject || values.sEmployee) ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h5>
                          <h2
                            style={{
                              fontSize: "12px",
                              transform: "none",
                            }}
                          >
                            Project : {values.sProject || values.sEmployee}
                          </h2>
                          {values.ProjectCode || values.iEmployee ? (
                            <h2
                              style={{
                                fontSize: "12px",
                                transform: "none",
                              }}
                            >
                              Code : {values.ProjectCode || values.iEmployee}
                            </h2>
                          ) : null}
                        </h5>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2
                        style={{
                          fontSize: "12px",
                          textAlign: "left",
                        }}
                      >
                        Project : N/A
                      </h2>
                      <h2
                        style={{
                          fontSize: "12px",
                          textAlign: "left",
                        }}
                      >
                        Code : N/A
                      </h2>
                    </>
                  )}

                  {/* Render a table component with 'modalData' */}

                  <Paper sx={{ width: "100%" }}>
                    <EnhancedTableToolbar
                      values={searchQuery}
                      changes={handleSearch}
                    />

                    {tableData && tableData.length > 0 && (
                      <TableContainer
                        style={{
                          display: "block",
                          maxHeight: "calc(100vh - 400px)",
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
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={tableData.length}
                            rows={Object.keys(tableData[0])}
                          />

                          <TableBody>
                            {visibleRows.map((row, index) => {
                              const labelId = `enhanced-table-checkbox-${index}`;

                              return (
                                <TableRow
                                  hover
                                  className={`table-row `}
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.iTransId}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {Object.keys(tableData[0]).map(
                                    (column, index) => {
                                      if (column !== "id") {
                                        return (
                                          <>
                                            <TableCell
                                              sx={{
                                                padding: "4px",
                                                border: "1px solid #ddd",
                                                whiteSpace: "nowrap",
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
                                          </>
                                        );
                                      }
                                    }
                                  )}
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
                      count={tableData?.length}
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
                </MDBModalBody>
              </MDBModalContent>
            </div>
          </div>
        </div>
      </Zoom>
    </div>
  );
}
