import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  ListSubheader,
  Paper,
} from "@mui/material";
import { GetRoles_GetAllEmployee } from "../../api/settingsApi";
import { colourTheme } from "../../config";

const GetRoleAutocomplete = ({
  apiKey,
  formData,
  setFormData,
  label,
  autoId,
  formDataName,
  formDataiId,
}) => {
  const [iTypeF2, setiTypeF2] = useState(1);
  const [searchkey, setsearchkey] = useState("");
  const [Menu, setMenu] = useState([]);

  // Effect to sync state with prop changes
  useEffect(() => {
    setsearchkey(formData[formDataName] || '');
  }, [formData, formDataName]);

  const handleAutocompleteChange = (event, newValue) => {
    const updatedFormData = {
      ...formData,
      [formDataName]: newValue ? newValue.sName : "",
      [formDataiId]: newValue ? newValue.iId : 0,
    };
    setFormData(updatedFormData); // This will now update the parent's state
    setiTypeF2(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await GetRoles_GetAllEmployee({ apiKey, searchkey });
        setMenu(JSON.parse(response.ResultData));

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [iTypeF2, searchkey]);

  const CustomListBox = React.forwardRef((props, ref) => {
    const { children, ...other } = props;
    return (
      <ul style={{ paddingTop: 0 }} ref={ref} {...other}>
        <ListSubheader style={{ backgroundColor: colourTheme, padding: "5px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography style={{ marginRight: "auto" }}>Name</Typography>
            <Typography style={{ marginLeft: "auto" }}>Code</Typography>
          </div>
        </ListSubheader>
        {children}
      </ul>
    );
  });

  return (
    <Autocomplete
      size="small"
      PaperComponent={({ children }) => (
        <Paper style={{ width: 'auto', minWidth: '150px', maxWidth: '600px' }}>{children}</Paper>
      )}
      id={autoId}
      options={Menu}
      getOptionLabel={(option) => option.sName}
      value={
        formData[formDataiId] ? Menu.find(option => option.iId === formData[formDataiId]) || null : null
      }
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) => {
        return options.filter(
          (option) =>
            option.sName.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.sCode.toLowerCase().includes(inputValue.toLowerCase())
        );
      }}
      onInputChange={(event, newInputValue) => {
        // Use this to trigger the API call
        setsearchkey(newInputValue); // You might debounce this call to reduce API requests
      }}
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
            <Typography
              style={{
                marginLeft: "auto",
                fontSize: "12px",
                fontWeight: "normal",
              }}
            >
              {option.sCode}
            </Typography>
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          required
          label={`select ${label}`}
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
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
      ListboxComponent={CustomListBox}
      style={{ width: " auto" }}
    />
  );
};

export default GetRoleAutocomplete;
