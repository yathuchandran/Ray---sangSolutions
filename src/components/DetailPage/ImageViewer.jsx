import React from "react";
import { Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { buttonColors, secondaryColorTheme } from "../../config";

const ImageModal = ({ isOpen, imageUrl, handleCloseImagePopup }) => {
  const buttonStyle = {
    textTransform: "none",
    color: `${secondaryColorTheme}`,
    backgroundColor: `${buttonColors}`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseImagePopup}>
      <DialogContent>
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Not accessible"
              style={{ width: "100%" }}
            />
          </>
        ) : (
          <Typography variant="body1">
            Image not found or not accessible.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
