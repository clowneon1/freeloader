import React, { useEffect, useState } from "react";
import "./DriveComponent.css"; // Import CSS file for styling
import FileList from "./FileList"; // Import the FileList component
import axios from "../../api/axiosConfig";

const DriveComponent = () => {
  const [filesProperties, setFilesProperties] = useState([]);

  useEffect(() => {
    getAllFilesProperties();
  }, []);

  const getAllFilesProperties = async () => {
    const res = await axios.get("/drive");
    console.log(res.data);
    setFilesProperties(res.data);
  };

  const handleDownload = async (fileProperties) => {
    try {
      const response = await axios.get(`/download/${fileProperties._id}`, {
        responseType: "blob",
      });

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

  return (
    <div className="drive-container">
      <FileList
        filesProperties={filesProperties}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default DriveComponent;
