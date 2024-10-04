import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { getCompany } from "../../api/apiCall";

export default function AutoComplete3({
  label,
  value,
  onChangeName,
  employeeDet,
}) {
  const [suggestion, setSuggestion] = useState([]);
  const [open, setOpen] = React.useState(false);

  const incidentType = [
    { sName: "Near Miss", iId: 1 },
    { sName: "First Aid Case", iId: 2 },
    { sName: "Restricted Work", iId: 3 },
    { sName: "Medically Treated", iId: 4 },
    { sName: "Lost Time Injury", iId: 5 },
    { sName: "Fatality", iId: 6 },
    { sName: "Occupational Illness", iId: 7 },
    { sName: "Asset Damage", iId: 8 },
    { sName: "Environmental Damage", iId: 9 },
    { sName: "Traffic Accident", iId: 10 },
    { sName: "Roll Over", iId: 11 },
    { sName: "Other", iId: 12 },
  ];

  const severityRates = [
    { sName: "Catastrophic", iId: 1 },
    { sName: "Major", iId: 2 },
    { sName: "Moderate", iId: 3 },
    { sName: "Minor", iId: 4 },
  ];

  const potentialRates = [
    { sName: "Rare", iId: 1 },
    { sName: "Unlikely", iId: 2 },
    { sName: "Possible", iId: 3 },
    { sName: "Likely", iId: 4 },
    { sName: "Almost Certain", iId: 5 },
  ];
  const type = [
    { sName: "Corrective", iId: 1 },
    { sName: "Preventive", iId: 2 },
  ];

  const status = [
    { sName: "Active", iId: 1 },
    { sName: "InActive", iId: 2 },
  ];

  const newCompany = [{ iId: 3, sName: "Subcontract", sCode: "3" }];

  const fetchData = async () => {
    const response = await getCompany();
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setSuggestion(myObject);
    } else {
      setSuggestion([]);
    }
  };

  useEffect(() => {
    if (label === "Incident Type") {
      setSuggestion(incidentType);
    } else if (label === "Severity rate") {
      setSuggestion(severityRates);
    } else if (label === "Potential rate") {
      setSuggestion(potentialRates);
    } else if (label === "Type") {
      setSuggestion(type);
    } else if (label === "Status") {
      setSuggestion(status);
    } else if (label === "Company") {
      if (employeeDet?.iId === 2552) {
        setSuggestion(newCompany);
      } else {
        fetchData();
      }
    } else {
      setSuggestion([]);
    }
  }, [label, employeeDet]);

  const getOptionById = (id, options) => {
    return options.find((option) => option.iId === id) || null;
  };

  return (
    <>
      <Autocomplete
        id={`size-small-filled-assetType`}
        size="small"
        value={getOptionById(value?.iId, suggestion)}
        onChange={(event, newValue) => {
          onChangeName(newValue);
        }}
        options={suggestion.map((data) => ({
          sName: data?.sName,
          sCode: data?.sCode,
          iId: data?.iId,
        }))}
        filterOptions={(options, { inputValue }) => {
          const inputLowerCase = inputValue.toLowerCase();
          return options.filter((option) =>
            option.sName.toLowerCase().startsWith(inputLowerCase)
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
        style={{ width: `auto` }}
      />
    </>
  );
}
