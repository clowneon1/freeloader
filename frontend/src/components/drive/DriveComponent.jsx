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

  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
