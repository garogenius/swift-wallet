declare module "react-qr-scanner" {
    import * as React from "react";
  
    interface QrScannerProps {
      delay?: number | boolean;
      onError?: (error: Error) => void;
      onScan?: (data: { text: string } | null) => void;
      style?: React.CSSProperties;
      className?: string;
    }
  
    const QrScanner: React.FC<QrScannerProps>;
    export default QrScanner;
  }
  