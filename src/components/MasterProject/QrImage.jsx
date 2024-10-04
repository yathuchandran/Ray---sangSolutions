import React, { useState, useRef } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { buttonColors, secondaryColorTheme } from "../../config";
import QRCode from "qrcode.react";
import DownloadIcon from "@mui/icons-material/Download";

const QrImage = ({ isOpen, imageUrl, handleCloseImagePopup }) => {
  const [isHovered, setIsHovered] = useState(false);
  const qrRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const downloadQRCode = () => {
    const qrCodeElement = qrRef.current.querySelector("canvas");
    const qrSize = 1000; // QR code size
    const borderSize = 50; // Border size

    const canvas = document.createElement("canvas");
    canvas.width = qrSize + 2 * borderSize;
    canvas.height = qrSize + 2 * borderSize;
    const context = canvas.getContext("2d");

    // Draw a white background with a white border
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the existing QR code onto the new canvas
    context.drawImage(qrCodeElement, borderSize, borderSize, qrSize, qrSize);

    const qrCodeURL = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseImagePopup}>
      <DialogContent
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: "relative", width: "fit-content" }}
      >
        <div className="App d-flex justify-content-center" ref={qrRef}>
          <QRCode
            id="qrCodeEl"
            size={500}
            value={imageUrl}
            bgColor="#FFFFFF" // Set the background color to white
            level="H" // High error correction level to handle the padding/border
          />
        </div>
        {isHovered && (
          <IconButton
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: `${secondaryColorTheme}`,
              color: `${buttonColors}`,
            }}
            onClick={downloadQRCode}
          >
            <DownloadIcon />
          </IconButton>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QrImage;
