import * as React from "react";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Loader from "../../components/Loader/Loader";
import { getActions_React, getScreen_React } from "../../api/settingsApi";

export default function RoleTree({ menuAction, id, handleChild }) {
  const [menu, setMenu] = React.useState([]);
  const [action, setAction] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      const response = await getScreen_React();
      handleClose();
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setMenu(myObject);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    setList(menuAction);
  }, [menuAction]);

  React.useEffect(() => {
    handleChild(list);
  }, [list, handleChild]);

  const handleAction = async (iId, type) => {
    if (!type) {
      handleOpen();
      const response2 = await getActions_React({ iScreenId: iId });
      handleClose();
      if (response2?.Status === "Success") {
        const myObject2 = JSON.parse(response2?.ResultData);
        setAction(myObject2);
      }
    } else {
      setAction([]);
    }
  };

  const renderTree = (items) => {
    return items.map((item) => (
      <TreeItem
        key={`${item.iScreenId}-${item.iParent}`}
        onClick={() => handleAction(item?.iScreenId, item?.bGroup)}
        itemId={`${item.iScreenId}-${item.iParent}`}
        label={item.sScreen}
      >
        {item.bGroup && renderTree(getChildren(item.iScreenId))}
      </TreeItem>
    ));
  };

  const getChildren = (parentId) => {
    return menu.filter((item) => item.iParent === parentId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const isAllActionsChecked = () => {
    return action.every((action) =>
      list.some(
        (item) =>
          item?.iScreenId === action?.iScreenId &&
          item?.iActionId === action?.iActionId
      )
    );
  };


  const handleCheckboxChangeAll = (event) => {
    const checked = event.target.checked;
    if (checked) {
      const newData = action.map((item) => {
        const { sAction, ...rest } = item; // Using object destructuring to exclude sAction
        return rest;
      });
      setList((prevData) => [...prevData, ...newData]);
    } else {
      const filteredArray = list.filter(
        (item) =>
          !action.some(
            (actionItem) =>
              item.iScreenId=== actionItem.iScreenId&&
              item.iActionId === actionItem.iActionId
          )
      );
      setList(filteredArray);
    }
  };

  const handleCheckboxChange = (event, actionData) => {
    const checked = event.target.checked;
    if (checked) {
      const { sAction, ...rest } = actionData; // Using object destructuring to exclude sAction
      setList((prevData) => [...prevData, rest]);
    } else {
      setList((prevData) =>
        prevData.filter((item) => !(item.iActionId === actionData.iActionId && item.iScreenId === actionData.iScreenId))
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          "@media (max-width: 600px)": {
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            background: "white",
            padding: 2,
            borderRadius: 2,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            height: 460,
            overflow: "scroll",
            scrollbarWidth: "thin",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <SimpleTreeView>{renderTree(getChildren(0))}</SimpleTreeView>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            background: "white",
            padding: 2,
            borderRadius: 2,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            height: 460,
            overflow: "scroll",
            scrollbarWidth: "thin",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Action
          </Typography>
          {action.length > 0 ? (
            <>
              <FormControl component="fieldset">
                {action.map((actionItem) => {
                  const isSelected = list.some(
                    (item) =>
                      item?.iScreenId === actionItem?.iScreenId &&
                      item?.iActionId === actionItem?.iActionId
                  );

                  return (
                    <FormControlLabel
                      key={actionItem.iActionId}
                      control={
                        <Checkbox
                          onChange={(event) =>
                            handleCheckboxChange(event, actionItem)
                          }
                          checked={isSelected}
                          id={`action-${actionItem.iActionId}`}
                          size="small"
                          color="primary"
                        />
                      }
                      label={actionItem.sAction}
                    />
                  );
                })}
              </FormControl>
              <Box
                sx={{
                  bottom: "10px",
                  right: "10px",
                  display: "flex",
                  float: "right",
                  gap: "5px",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`check-all`}
                      size="small"
                      color="primary"
                      checked={isAllActionsChecked()}
                      onChange={handleCheckboxChangeAll}
                    />
                  }
                  label="Select All"
                />
              </Box>
            </>
          ) : null}
        </Box>
      </Box>
      <Loader open={open} handleClose={handleClose} />
    </>
  );
}
