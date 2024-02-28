import React, { useState } from "react";
import "./DriveComponent.css"; // Import CSS file for styling

const FileList = ({ filesProperties, handleDownload }) => {
  const [selectedFiles, setSelectedFiles] = useState({}); // State to track selected files
  const [downloading, setDownloading] = useState(false); // State to track download status

  const GB_CONVERSION = 1000000000;
  const MB_CONVERSION = 1000000;
  const KB_CONVERSION = 1000;

  const calculateVolume = (fileProperties) => {
    let totalSizeGB = 0;
    for (const fileProperty of fileProperties) {
      totalSizeGB += fileProperty.size / (1024 * 1024 * 1024); // Convert bytes to GB as we sum up
    }
    return totalSizeGB.toFixed(2) + " GB";
  };

  const convertSize = (size) => {
    let fileSize;
    if (size >= GB_CONVERSION) {
      fileSize = `${(size / GB_CONVERSION).toFixed(2)} GB`;
    } else if (size >= MB_CONVERSION) {
      fileSize = `${(size / MB_CONVERSION).toFixed(2)} MB`;
    } else if (size >= KB_CONVERSION) {
      fileSize = `${(size / KB_CONVERSION).toFixed(2)} KB`;
    } else {
      fileSize = `${size} bytes`;
    }
    return fileSize;
  };

  const handleCheckboxChange = (index) => {
    setSelectedFiles((prevState) => {
      return { ...prevState, [index]: !prevState[index] };
    });
  };

  const handleDownloadSelected = () => {
    const selectedFilesArray = Object.keys(selectedFiles).filter(
      (key) => selectedFiles[key]
    );
    const filesToDownload = selectedFilesArray.map(
      (index) => filesProperties[index]
    );
    setDownloading(true); // Set downloading state to true
    Promise.all(filesToDownload.map((file) => handleDownload(file)))
      .then(() => {
        setDownloading(false); // Set downloading state to false when all downloads are completed
      })
      .catch((error) => {
        console.error("Error downloading files:", error);
        setDownloading(false); // Set downloading state to false if any error occurs during download
      });
  };

  return (
    <div className="file-list-container">
      <div>
        <h2 className="file-list-title">Uploaded Files</h2>
        <span className="total-files">
          Total files: {filesProperties.length}
        </span>
        <span className="total-files">
          Uploaded volume: {calculateVolume(filesProperties)}
        </span>
      </div>

      <table className="file-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Size</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {filesProperties.map((fileProperties, index) => (
            <tr key={index}>
              <td>{fileProperties.name}</td>
              <td>{fileProperties.date}</td>
              <td>{convertSize(fileProperties.size)}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedFiles[index] || false}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="download-btn"
        onClick={handleDownloadSelected}
        disabled={downloading} // Disable the button if downloading is in progress
      >
        {downloading ? "Downloading..." : "Download Selected"}
      </button>
    </div>
  );
};

export default FileList;
