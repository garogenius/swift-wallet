import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import { ArrowLeft, Zap, ZapOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const QrScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false); // State for flashlight
  const { theme } = useTheme();
  const qrReaderRef = useRef<any>(null); // Ref for QrReader component

  // Toggle flashlight
  const toggleFlashlight = () => {
    if (qrReaderRef.current) {
      const videoTrack = qrReaderRef.current.getVideoTrack();
      if (videoTrack) {
        videoTrack.applyConstraints({ advanced: [{ torch: !torchOn }] });
        setTorchOn(!torchOn);
      } else {
        console.warn("Flashlight not supported on this device.");
      }
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 z-10"
      >
        <ArrowLeft size={24} className="text-gray-600 dark:text-white" />
      </button>

      {/* QR Scanner */}
      <div className="h-full w-full">
        <QrReader
          ref={qrReaderRef}
          onResult={(result, error) => {
            if (result) {
              const scannedText = result.getText();
              setScanResult(scannedText);
              setTimeout(() => navigate("/", { state: { scannedData: scannedText } }), 2000); // Redirect after scanning
            }
            if (error) {
              console.error("QR Scan Error:", error);
            }
          }}
          constraints={{ facingMode: "environment" }}
          containerStyle={{ width: "100%", height: "100%", position: "relative" }}
          videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <p className="text-white text-lg mb-4">Scan QR Code</p>
        <div className="w-64 h-64 border-4 border-white rounded-lg relative">
          {/* Flashlight Toggle Button */}
          <button style={{marginTop:290}}
            onClick={toggleFlashlight}
            className="absolute -bottom-13 left-1/2 transform -translate-x-1/2 p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 z-10 flex items-center justify-center"
          >
            {torchOn ? (
              <ZapOff size={24} className="text-gray-600 dark:text-white" />
            ) : (
              <Zap size={24} className="text-gray-600 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Display Scan Result */}
      {scanResult && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 p-4 rounded-lg text-white text-center max-w-[90%]">
          <p>Scanned: {scanResult}</p>
        </div>
      )}
    </div>
  );
};

export default QrScannerPage;