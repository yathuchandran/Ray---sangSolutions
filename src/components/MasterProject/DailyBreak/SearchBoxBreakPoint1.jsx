import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { CustomScroll } from "react-custom-scroll";


const Root = styled("div")`
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
`;

const InputWrapper = styled("div")``;

const Item = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  & svg {
    font-size: 20px;
    cursor: pointer;
  }
`;

const SearchBoxBreakPoint1 = React.memo(({ initialItems, search ,handleSelectedIds, params,changeTriggered,setchangesTriggered,initialCheckedIds = [],}) => {

  
  
  const [selectAll, setSelectAll] = useState(false);
  const [items, setItems] = useState(initialItems.reduce((acc, item) => ({ ...acc, [item.iId]: false }), {}));
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(50);

  const filteredItems = initialItems.filter((item) =>
    item.title.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  //give filtereditems instead of initialitem if select all needed to check all filtereditems only
   const handleSelectAll = () => {
    
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      for (const item of initialItems) {
        updatedItems[item.iId] = !selectAll;
      }
      return updatedItems;
    });
    setSelectAll(!selectAll);
    
  };
  
  const handleItemToggle = (iId) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      updatedItems[iId] = !prevItems[iId];
      return updatedItems;
    });
  }




useEffect(() => {
  if (filteredItems.length > 0) {
    const allSelected = initialItems.every((item) => items[item.iId]);
    setSelectAll(allSelected);
  } else {
    setSelectAll(false);
  }
}, [filteredItems, items]);

useEffect(() => {
  // Create an array of selected item IDs
  const selectediId = Object.keys(items).filter((iId) => items[iId]);

  const selectediIdString = Object.keys(items).filter((iId) => items[iId]).map(String);
  // Create an array of titles for the selected items
  const selectedTitles = initialItems
  .filter((item) => selectediIdString.includes(String(item.iId)))
  .map((item) => item.title);
    
  // Pass the selected IDs, params, and selected titles to the handler
  handleSelectedIds(selectediId, params, selectedTitles);
 
  
}, [items, handleSelectedIds, params]);

useEffect(() => {
  // Reset all items when changeTriggered changes
  if (changeTriggered) {
    
    const resetItems = initialItems.reduce((acc, item) => ({ ...acc, [item.iId]: false }), {});
    setItems(resetItems);
    setSelectAll(false);
    setchangesTriggered(false)
  }
}, [changeTriggered, initialItems]);

useEffect(() => {
  // Initialize items based on initialCheckedIds
  const newItems = initialItems.reduce((acc, item) => ({
    ...acc,
    [item.iId]: initialCheckedIds.includes(item.iId), // Check if the iId is in initialCheckedIds
  }), {});

  setItems(newItems);

  // ...

}, [initialItems, initialCheckedIds]);
  return (
    <Root style={{
      width: "auto",
      flexDirection: "column",
      height: "320px",
      overflowY: "hidden",

      
      boxSizing: "border-box",
      borderRadius: 5,
    }}>
       
      <InputWrapper   sx={{position:"sticky",top:0,backgroundColor:"#fff",zIndex:2,paddingTop:"20px"}}>
      {search && (
        <div >
          <TextField
            variant="outlined"
            label="Search"
            // id="IpWSB"
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value)}}
            sx={{
               // Adjust the width as needed
              "& .MuiInputBase-root": {
                height: 30, // Adjust the height of the input area
              },
              "& .MuiInputLabel-root": {
                transform: "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
              },
              "& .MuiInputBase-input": {
                fontSize: "0.75rem", // Adjust the font size of the input text
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "currentColor", // Keeps the current border color
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "currentColor", // Optional: Keeps the border color on hover
              },
            }}
          />
          {/* <IconButton>
            <SearchIcon id="searchIconSB" />
          </IconButton> */}
        </div>
        )}
        { filteredItems && filteredItems.length >0 &&

       
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={selectAll}
              onChange={handleSelectAll}
              
            />
          }
          label={
            <span style={{ fontSize: "12px", padding: "0px" }}>Select All</span>
          }
          style={{ marginLeft: !search ? "5vw" : "1vw" }}
        />
      }
      </InputWrapper>
      <CustomScroll heightRelativeToParent="60%">
      <div>
        {filteredItems.slice(0, displayLimit).map((item, index) => (
          <Item key={item.iId} style={{ height: "25px" }}>
            <FormControlLabel
              control={
                <Checkbox
                checked={!!items[item.iId]} // Using !! to ensure it's always a boolean
                onChange={() => handleItemToggle(item.iId)}
                />
              }
              label={
                <span style={{ fontSize: "12px", padding: "0px" }}>
                  {item.title}
                </span>
              }
            />
          </Item>
        ))}
        {filteredItems && filteredItems.length >displayLimit && displayLimit < initialItems.length && (
        <IconButton
          onClick={() => {
            setDisplayLimit((prevLimit) => prevLimit + 50); // Increase the display limit
             // Display the next set of items
          }}
          sx={{padding:0}}
        >
          +
        </IconButton>
      )}
      </div>
      </CustomScroll>
    </Root>
  );
});

export default SearchBoxBreakPoint1;
