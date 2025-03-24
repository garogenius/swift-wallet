import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import '../index.css';

const QrScannerComponent: React.FC<{ onScan: (data: string) => void }> = ({ onScan }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);

  return (
    <div className="qr-scanner-container">
      <QrReader
        onResult={(result, error) => {
          if (result) {
            const scannedText = result.getText();
            setScanResult(scannedText);
            onScan(scannedText);
          }
          if (error) {
            console.error("QR Scan Error:", error);
          }
        }}
        constraints={{ facingMode: "environment" }} // Use rear camera
        containerStyle={{ width: "100vw", height: "100vh" }}
        videoStyle={{ objectFit: "cover" }} // Ensures full-screen camera
      />
      <div className="qr-overlay">
        <p className="qr-instructions">Scan QR Code</p>
        <div className="qr-frame"></div>
      </div>
      {scanResult && <p className="scan-result">Scanned: {scanResult}</p>}
    </div>
  );
};

export default QrScannerComponent;
