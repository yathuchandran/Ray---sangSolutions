import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import Loader from "../../components/Loader/Loader";
import { GetAllEmployee, GetEmployee } from "../../api/api";

export default function SiteIncharge({
  value,
  apiName,
  onChangeDes,
  onChangeName,
}) {
  const [suggestion, setSuggestion] = useState([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      const response = await GetAllEmployee({
        sSearch: ""
      });
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setSuggestion(myObject);
      } else {
        setSuggestion([]);
      }
      handleClose();
    };
    fetchData();
  }, [value]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     handleOpen();
  //     if (value && value.iId) {
  //       const response = await getProjectDescription({ iProject: value?.iId });
  //       if (response.Status === "Success") {
  //         const myObject = JSON.parse(response.ResultData);
  //         onChangeDes(myObject[0]?.sDescription);
  //       }
  //     }
  //     handleClose();
  //   };
  //   fetchData();
  // }, [value]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Autocomplete
        id={`size-small-filled-assetType`}
        size="small"
        value={value || ""}
        onChange={(event, newValue) => {
          onChangeName(newValue);
       ;
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
            label="Site In Charge"
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
      {/* <Loader open={open} handleClose={handleClose} /> */}
    </>
  );
}
