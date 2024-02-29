import React, { useEffect, useState } from "react";
import "./DriveComponent.css"; // Import CSS file for styling
import FileList from "./FileList"; // Import the FileList component
import axios from "../../api/axiosConfig";

const DriveComponent = () => {
  const [filesProperties, setFilesProperties] = useState([]);
  const [password, setPassword] = useState("");

  useEffect(() => {
    getAllFilesProperties();
  }, []);

  const getAllFilesProperties = async () => {
    const res = await axios.get("/drive");
    console.log(res.data);
    setFilesProperties(res.data);
  };

  const handleDownload = async (fileProperties) => {
    const queryParams = { password };
    try {
      const response = await axios.get(`/download/${fileProperties._id}`, {
        responseType: "blob",
        params: queryParams,
      });
      if (response.status === 400 || response.status == 500)
        alert(response.data.message);

      const url = URL.createObjectURL(response.data);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileProperties.name; // or set a custom name if needed
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Handle error (e.g., show a message to the user)
    }
  };
  const calculateVolume = (fileProperties) => {
    let totalSizeGB = 0;
    for (const fileProperty of fileProperties) {
      totalSizeGB += fileProperty.size / (1024 * 1024 * 1024); // Convert bytes to GB as we sum up
    }
    return totalSizeGB.toFixed(2) + " GB";
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="drive-container">
      <div>
        <h2 className="file-list-title">Uploaded Files</h2>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
        />
        <span className="total-files">
          Total files: {filesProperties.length}
        </span>
        <span className="total-files">
          Uploaded volume: {calculateVolume(filesProperties)}
        </span>
      </div>

      <FileList
        filesProperties={filesProperties}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default DriveComponent;
