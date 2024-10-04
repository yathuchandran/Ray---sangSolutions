import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { buttonColors, secondaryColorTheme } from "../../config";

const ImageModal = ({ open, handleClose, images }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    if (images) {
      if (typeof images === "string") {
        setImageUrls(images.split(",")); // If images is a string, split it into an array of image URLs
      } else if (Array.isArray(images)) {
        setImageUrls(images); // If images is already an array, use it directly
      }
    }
  }, [images]);
  const buttonStyle = {
    textTransform: "none",
    color: `${secondaryColorTheme}`,
    backgroundColor: `${buttonColors}`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
     <DialogContent>
  {imageUrls && imageUrls.length > 0 ? (
    <>
      <IconButton onClick={handleClose} aria-label="close" sx={{ position: "absolute", top: 0, right: 0, marginRight: 2 }}>
        <CancelIcon />
      </IconButton>
      <img src={imageUrls[currentImageIndex]} alt={`Image ${currentImageIndex}`} style={{ width: "100%", marginBottom: "10px" }} />
      <div style={{ textAlign: "center" }}>
        <IconButton onClick={handlePreviousImage} aria-label="previous" sx={{ ...buttonStyle, fontSize: 'small' }}>
        Previous
          {/* <ArrowBackIcon /> */}
        </IconButton>
        <IconButton onClick={handleNextImage} aria-label="next" sx={{ ...buttonStyle, fontSize: 'small' }}>
           Next
          {/* <ArrowForwardIcon /> */}
        </IconButton>
      </div>
    </>
  ) : (
    <Typography variant="body1">No images found.</Typography>
  )}
</DialogContent>

    </Dialog>
  );
};

export default ImageModal;
