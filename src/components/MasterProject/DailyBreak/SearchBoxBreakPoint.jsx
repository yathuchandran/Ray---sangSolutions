import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";


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

const SearchBoxBreakPoint = React.memo(({ initialItems, selected, params, handleChild }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [items, setItems] = useState(
    initialItems.reduce((acc, item) => ({ ...acc, [item.iId]: false }), {})
  );
  const [displayLimit, setDisplayLimit] = useState(50);

  const filteredItems = initialItems.filter((item) => item.title.toLowerCase());

  useEffect(() => {
    // Initialize items based on initialCheckedIds
    const newItems = initialItems.reduce((acc, item) => ({
      ...acc,
      [item.iId]: selected.includes(item.iId), // Check if the iId is in initialCheckedIds
    }), {});
    setItems(newItems);
  }, [initialItems, selected]);

  const handleSelectAll = () => {
    // Toggle select all
    setSelectAll(!selectAll);
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      for (const item of initialItems) {
        updatedItems[item.iId] = !selectAll;
      }
      return updatedItems;
    });
  };

  const handleItemToggle = (iId) => {
    // Toggle the state of a single item
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      updatedItems[iId] = !prevItems[iId];
      return updatedItems;
    });
  };

  useEffect(() => {
    // Check if all items are selected
    const allSelected = initialItems.every((item) => items[item.iId]);
    setSelectAll(allSelected);
    handleChild(items); // Call the handler with updated items
  }, [items]); // Remove unnecessary dependency to avoid infinite loop

  return (
    <Root>
      <InputWrapper id="inputwrapperSB">
        {filteredItems && filteredItems.length > 0 && (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={selectAll}
                onChange={handleSelectAll}
                style={{ marginLeft: "5vw" }}
              />
            }
            label={
              <span style={{ fontSize: "12px", padding: "0px" }}>
                Select All
              </span>
            }
          />
        )}
      </InputWrapper>

      <div>
        {filteredItems.slice(0, displayLimit).map((item, index) => (
          <Item key={index} style={{ height: "25px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={items[item.iId]}
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
        {filteredItems &&
          filteredItems.length > displayLimit &&
          displayLimit < initialItems.length && (
            <IconButton
              onClick={() => {
                setDisplayLimit((prevLimit) => prevLimit + 50); // Increase the display limit
              }}
            >
              +
            </IconButton>
          )}
      </div>
    </Root>
  );
});

export default SearchBoxBreakPoint;
