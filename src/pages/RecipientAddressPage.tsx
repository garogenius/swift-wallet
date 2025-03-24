import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipientAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Recipient Address</h1>

      <button
        onClick={() => navigate("/scan")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open QR Scanner
      </button>

      {address && (
        <p className="mt-2 text-green-600 font-bold">
          Scanned Address: {address}
        </p>
      )}
    </div>
  );
};

export default RecipientAddressPage;
