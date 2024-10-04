import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const exportToExcelForm = async (filteredData, excludedKeys, pageName) => {
  const workbook = new ExcelJS.Workbook();
  const rowsPerSheet = 1000000;

  for (
    let sheetIndex = 0;
    sheetIndex < Math.ceil(filteredData.length / rowsPerSheet);
    sheetIndex++
  ) {
    const startRow = sheetIndex * rowsPerSheet;
    const endRow = Math.min(
      (sheetIndex + 1) * rowsPerSheet,
      filteredData.length
    );

    const worksheet = workbook.addWorksheet(`Report - Sheet ${sheetIndex + 1}`);

    // Style for the first row (Page Name)
    worksheet.mergeCells("A1:J1");
    const mainHeadingCell = worksheet.getCell("A1");
    mainHeadingCell.value = pageName;
    mainHeadingCell.font = { size: 18, bold: true };
    mainHeadingCell.alignment = { horizontal: "left" };

    // Add subheading for date range
    worksheet.mergeCells("A2:J2");
    const dateRangeCell = worksheet.getCell("A2");
    dateRangeCell.font = { size: 14, bold: true };
    dateRangeCell.alignment = { horizontal: "left" };

    // Define border styles
    const borderStyle = { style: "thin" };

    // Apply border styles to main heading and subheading
    for (let row = 1; row <= 2; row++) {
      for (let col = 1; col <= 10; col++) {
        const cell = worksheet.getCell(
          `${String.fromCharCode(64 + col)}${row}`
        );
        cell.border = borderStyle;
      }
    }
    // Add headers
    const headerStyle = {
      alignment: { horizontal: "left" },
      font: { bold: true },
    };
    const headers = Object.keys(filteredData[0])
      .filter((key) => !excludedKeys.includes(key))
      .map((key) => ({
        header: getHeaderName(key),
        key: key,
        width: getColumnWidth(key),
      }));

    const headerRow = worksheet.addRow(headers.map((header) => header.header));
    headerRow.eachCell((cell, colNumber) => (cell.style = headerStyle));

    // Add data rows
    const dataCellStyle = { alignment: { horizontal: "left" } };
    for (let i = startRow; i < endRow; i++) {
      const rowData = headers.map((header) => filteredData[i][header.key]);
      const dataRow = worksheet.addRow(rowData);
      dataRow.eachCell((cell, colNumber) => (cell.style = dataCellStyle));
    }

    // Adjust column widths
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber > 2) {
          // Adjust row number based on main heading and subheading
          const content = cell.value ? cell.value.toString() : "";
          const contentLength = content.length;
          maxLength = Math.max(maxLength, contentLength);
        }
      });
      column.width = Math.max(maxLength, 15);
    });
  }

  // Generate filename
  const timestamp =
    new Date().toISOString().replace(/:/g, "-").split("T")[0] +
    "" +
    new Date().toLocaleTimeString().split(" ").join("");
  const filename = `${pageName}_${timestamp}.xlsx`;

  // Save Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const excelBlob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(excelBlob, filename);
};

// Helper function to get header names
const getHeaderName = (key) => {
  switch (key) {
    case "iId":
      return "Id";
    case "sName":
      return "Name";
    case "sCode":
      return "Code";
    case "sAltName":
      return "AltName";
    default:
      return key;
  }
};

// Helper function to calculate column width
const getColumnWidth = (key) => {
  // Adjust the width as needed for each column
  switch (key) {
    case "iId":
    case "sName":
    case "sCode":
    case "sAltName":
      return 20;
    default:
      return 15;
  }
};

export default exportToExcelForm;
