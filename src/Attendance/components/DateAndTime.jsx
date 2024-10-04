import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useEffect } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./attendanceNew.css";

dayjs.extend(customParseFormat);

const customTheme = createTheme({
  components: {
    MuiInputBase: {
      // Targeting the input component
      styleOverrides: {
        input: {
          fontSize: "0.875rem", // Reduce font size
          padding: "0px", // Adjust padding as needed
        },
        root: {
          height: "37px", // Ensure TextField takes the full height of its parent
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          // Adjusting the outlined label style
          transform: "translate(14px, 10px) scale(0.85)", // Label position when not shrunk
          "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -6px) scale(0.75)", // Label position when shrunk
            backgroundColor: "#fff",
            padding: "0 2px",
          },
        },
      },
    },
    MuiPicker: {
      styleOverrides: {
        // This is a hypothetical selector; you'll need to adjust based on actual class names or component structure
        pickerContainer: {
          overflow: 'hidden', // Attempt to hide overflow and thus scrollbars
        },
        // If the above doesn't work, consider targeting more specific parts
      },
    },
    

    // If you need to target the picker dialog specifically, you can add overrides for MuiPickersModal or similar components here
  },
});

export default function BasicDateTimePicker({
  formData,
  setFormData,
  formDataName1,
  formDataName2,
  label,
}) {
  const [initialDateTime, setInitialDateTime] = useState(null);

  // When the DateTimePicker value changes, update the display and formData state
  const handleDateTimeChange = (newValue) => {
    const newDate = dayjs(newValue);
    const computedDateTime = dayjs(
      `${newDate.format("DD-MM-YYYY")}T${newDate.format("HH:mm:ss")}`,
      "DD-MM-YYYYTHH:mm:ss"
    );

    
    setFormData({
      ...formData,
      [formDataName1]: newDate.format("DD-MM-YYYY"),
      [formDataName2]: newDate.format("HH:mm:ss"), // Keep seconds in the output
    });
  };

  useEffect(() => {
    // Parse the initial date and time using the correct format
    const formattedDate = `${formData[formDataName1]} ${formData[formDataName2]}`;
    const parsedCheckInDateTime = dayjs(formattedDate, "DD-MM-YYYY HH:mm:ss");

    // Check if the parsed dates are valid Dayjs objects
    if (!parsedCheckInDateTime.isValid()) {
      //console.error("Invalid date format in formData", formData);
      return; // Don't proceed if the dates are invalid
    }

    // Set initial date time to the check-in date and time
    setInitialDateTime(parsedCheckInDateTime);
  }, [formData]);

  

  return (
    <ThemeProvider theme={customTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <Box sx={{ minWidth: "100%", maxWidth: "100%", height: "auto" }}>
          <DateTimePicker
            slotProps={{
              actionBar: {
                actions: ["accept","today", "clear","cancel"],
              },
            }}
            views={["year", "month", "day", "hours", "minutes", "seconds"]}
            label={label}
            value={initialDateTime}
            onChange={handleDateTimeChange}
            ampm={false}
            format="DD-MM-YYYY HH:mm:ss"
            timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
            disableFuture
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
