import React, { useState } from "react";
import "./DriveComponent.css"; // Import CSS file for styling

const FileList = ({ filesProperties, handleDownload, handleDelete }) => {
  const [selectedFiles, setSelectedFiles] = useState({}); // State to track selected files
  const [downloading, setDownloading] = useState(false); // State to track download status
  const [deleting, setDeleting] = useState(false); // State to track delete status

  const GB_CONVERSION = 1000000000;
  const MB_CONVERSION = 1000000;
  const KB_CONVERSION = 1000;

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

  const handleDeleteSelected = async () => {
    const selectedFilesArray = Object.keys(selectedFiles).filter(
      (key) => selectedFiles[key]
    );
    setDeleting(true); // Set deleting state to true
    let fileIds = [];
    for (const index of selectedFilesArray) {
      fileIds.push(filesProperties[index]["_id"]);
    }
    handleDelete(fileIds);
    setDeleting(false); // Set deleting state to false when all delete operations are completed
  };

  return (
    <div className="file-list-container">
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
      <div>
        <button
          className="download-btn"
          onClick={handleDownloadSelected}
          disabled={downloading || deleting} // Disable the button if downloading or deleting is in progress
          style={{ display: deleting ? "none" : "inline-block" }} // Hide the button while deleting
        >
          {downloading ? "Downloading..." : "Download Selected"}
        </button>
        <button
          className="delete-btn"
          onClick={handleDeleteSelected}
          disabled={downloading || deleting} // Disable the button if downloading or deleting is in progress
          style={{ display: downloading ? "none" : "inline-block" }} // Hide the button while downloading
        >
          {deleting ? "Deleting..." : "Delete Selected"}
        </button>
      </div>
    </div>
  );
};

export default FileList;
