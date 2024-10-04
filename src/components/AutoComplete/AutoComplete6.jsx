import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Autocomplete, TextField, Typography } from "@mui/material"; // Import Autocomplete

export default function AutoComplete6({
  value,
  apiName,
  setValue,
  field,
  payload,
  required,
}) {
  const [suggestion, setSuggestion] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // State for loading indicator

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await apiName(payload);
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setSuggestion(myObject);
      } else {
        setSuggestion([]);
      }
      setLoading(false); // Turn off loading indicator
    };
    fetchData();
  }, [payload]);

  return (
    <Autocomplete
      id={`size-small-filled-assetType`}
      size="small"
      value={value || null}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      options={suggestion.map((data) => ({
        sName: payload ? data.sType : data.sForms,
        iId: data?.iId,
      }))}
      filterOptions={(options, { inputValue }) => {
        return options.filter((option) =>
          option.sName.toLowerCase().includes(inputValue.toLowerCase())
        );
      }}
      autoHighlight
      getOptionLabel={(option) => (option && option.sName ? option.sName : "")}
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
          required={required}
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
      style={{ width: `auto`, minWidth: 200 }}
    />
  );
}
