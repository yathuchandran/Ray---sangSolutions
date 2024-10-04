import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";

export default function AutoComplete2({
  value,
  apiName,
  setValue,
  field,
  setValue2,
}) {
  const [suggestion, setSuggestion] = useState([]);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      const response = await apiName();
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setSuggestion(myObject);
      } else {
        setSuggestion([]);
      }
      handleClose();
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!value) {
      setValue2("");
    }
  }, [value]);

  return (
    <>
      <Autocomplete
        id={`size-small-filled-assetType`}
        size="small"
        value={value || null}
        onChange={(event, newValue) => {
          setValue(newValue), setValue2(newValue.sCode);
        }}
        options={suggestion.map((data) => ({
          sName: data?.sName,
          sCode: data?.sCode,
          iId: data?.iId,
        }))}
        filterOptions={(options, { inputValue }) => {
          return options.filter((option) =>
            option.sName.toLowerCase().includes(inputValue.toLowerCase())
          );
        }}
        autoHighlight
        getOptionLabel={(option) =>
          option && option.sName ? option.sName : ""
        }
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
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            required
            label={field}
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
        style={{ width: `auto` }}
      />
      <Loader open={open} handleClose={handleClose} />
    </>
  );
}
