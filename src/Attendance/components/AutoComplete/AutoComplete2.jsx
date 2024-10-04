import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  ListSubheader,
  Paper,
  CircularProgress
} from "@mui/material";
import { debounce } from 'lodash';
import { getSupervisor_attendance } from "../../../api/apiHelper";
import { colourTheme } from "../../../config";

const AutoComplete2 = ({
  apiKey,
  formData,
  setFormData,
  label,
  autoId,
  formDataName,
  formDataiId,
  required
}) => {
  const [iTypeF2, setiTypeF2] = useState(1);
  const [searchkey, setsearchkey] = useState("");
  const [Menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  

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

  const fetchOptions = useCallback(debounce(async (searchKey) => {
    setLoading(true);
    try {
      const response = await getSupervisor_attendance({ apiKey, searchkey: searchKey });
      const results = JSON.parse(response?.ResultData);
      setMenu(results);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  }, 300), [apiKey]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const config = {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       };

  //       const response = await getSupervisor_attendance({ apiKey, searchkey });

  //       setMenu(JSON.parse(response.ResultData));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, [iTypeF2, searchkey]);
  useEffect(() => {
    
      fetchOptions(searchkey);
    
  }, [searchkey,iTypeF2, fetchOptions]);

  const handleInputChange = (event, newInputValue) => {
    setsearchkey(newInputValue);
  };

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
        <Paper style={{ width: 'auto', minWidth: '150px', maxWidth: '600px'  }}>{children}</Paper>
      )} 
      id={autoId}
      options={Menu}
      getOptionLabel={(option) => option.sName}
      // value={
      //   formData[formDataiId] ? Menu.find(option => option.iId === formData[formDataiId]) || null : null
      // }
      value={Menu.find(option => option.iId === formData[formDataiId]) || null}
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) => {
        return options.filter(
          (option) =>
            option.sName.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.sCode.toLowerCase().includes(inputValue.toLowerCase())
        );
      }}
      onInputChange={handleInputChange}
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
          required={required}
          label={label}
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

export default AutoComplete2;