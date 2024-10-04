import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async ({ReportName,filteredRows, formData,headers}) => {

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      let day = '' + date.getDate();
      let month = '' + (date.getMonth() + 1);
      const year = date.getFullYear();
  
      if (day.length < 2) day = '0' + day;
      if (month.length < 2) month = '0' + month;
  
      return [day, month, year].join('-');
    };
    function columnIndexToLetter(columnIndex) {
      let columnLetter = '';
      while (columnIndex > 0) {
        let remainder = (columnIndex - 1) % 26;
        columnLetter = String.fromCharCode(65 + remainder) + columnLetter;
        columnIndex = parseInt((columnIndex - remainder) / 26, 10);
      }
      return columnLetter;
    }
    


    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let sheet = null;
    let currentRowCount = 0;
    const rowsPerSheet = 1000000; // Maximum rows per sheet
    let sheetNumber = 0; // To increment sheet names if necessary
  // Create a new ExcelJS workbook
  const workbook = new ExcelJS.Workbook();

  // Add a sheet for the data
  const createNewSheet = () => {
    sheetNumber++;
    sheet = workbook.addWorksheet(`${ReportName} - ${sheetNumber}`);
    currentRowCount = 0; // Reset row count for the new sheet
    headers.forEach((header, index) => {
      sheet.getColumn(index + 1).width = 20;
  });
  const lastColumnLetter = columnIndexToLetter(headers.length);
  // Add the first two rows as in the image
  sheet.addRow([ReportName]);
  sheet.mergeCells(`A1:${lastColumnLetter}1`); // Merge cells for the title row
  sheet.getCell('A1').font = { size: 18, bold: true }; // Style the title row
  sheet.getCell('A1').alignment = { horizontal: "left" };

  // Add the From and To date row
  if(formData.FromDate){
    const fromDateFormatted = formatDate(formData.FromDate);
    const toDateFormatted = formatDate(formData.ToDate);
    sheet.addRow([`From Date: ${fromDateFormatted} To Date: ${toDateFormatted}`]);
    currentRowCount += 2;
  }
  if(formData.Month){
    const monthName = monthNames[formData.Month - 1];
    // Add a row to the sheet with the month name and year
    sheet.addRow([`Month: ${monthName} Year: ${formData.year}`]);
    currentRowCount += 2;
  }
 
  sheet.mergeCells(`A2:${lastColumnLetter}2`); // Merge cells for the from date
  sheet.getCell('A2').font = { size: 14,bold: true }; // Style the date row
  sheet.getCell('A2').alignment = { horizontal: "left" };
  // Style the headers

  
  const headerRow = sheet.addRow(headers);
  
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
   
  });
  currentRowCount++;
  }

  createNewSheet();
  
  // Add the data
  filteredRows.forEach((row) => {
    if (currentRowCount >= rowsPerSheet) {
      
      createNewSheet();
      
    }
    const rowData = headers.map(header => row[header]) || '';
    sheet.addRow(rowData);
    currentRowCount++;
  });


  // ... rest of your existing code to save the workbook

  // Write to a buffer and then save using FileSaver
  const formatDateTimeForFilename = () => {
    const now = new Date();
    let day = '' + now.getDate();
    let month = '' + (now.getMonth() + 1);
    const year = now.getFullYear();
    let hours = '' + now.getHours();
    let minutes = '' + now.getMinutes();
    let seconds = '' + now.getSeconds();

    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    return [day, month, year].join('-') + '_' + [hours, minutes, seconds].join('-');
};
  const buffer = await workbook.xlsx.writeBuffer();
  const dateTimeStringForFilename = formatDateTimeForFilename();
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${ReportName}_${dateTimeStringForFilename}.xlsx`);
};


