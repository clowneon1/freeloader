import React, { useState } from "react";
import "./Drive.css"; // Import CSS file for styling
import FileList from "./FileList"; // Import the FileList component

const Drive = () => {
  const [files, setFiles] = useState([]);

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
      <FileList files={files} handleDownload={handleDownload} />
    </div>
  );
};

export default Drive;
