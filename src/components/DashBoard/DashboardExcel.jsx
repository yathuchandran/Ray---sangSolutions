import * as XLSX from "xlsx";

export const generateExcelData = (data) => {
  const excelData = [["DocNo", "Date", "Location", "CreatedBy"]];

  data.forEach((item) => {
    excelData.push([item.DocNo, item.Date, item.Location, item.CreatedBy]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  return excelBuffer;
};

export function getCurrentDate() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0"); // Get the day and pad with '0' if needed
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Get the month and pad with '0' if needed
  const year = currentDate.getFullYear(); // Get the year

  return `${day}-${month}-${year}`;
}
