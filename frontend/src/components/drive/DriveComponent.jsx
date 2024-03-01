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

  const handleDelete = async (fileIds) => {
    // console.log(fileProperties);
    try {
      // Loop through each file ID
      for (const fileId of fileIds) {
        // Make a DELETE request using Axios for each ID
        const response = await axios.delete(`/delete/${fileId}`);

        // Check if the request was successful
        if (response.status === 200) {
          // Delete was successful
          console.log(`File with ID ${fileId} deleted successfully`);
          // Assuming you want to update the file list after deletion
          // You might have another method to refresh the file list
          getAllFilesProperties(); // Call a function to refresh the file list after deletion
        } else {
          // Delete failed
          console.error(`Failed to delete file with ID ${fileId}`);
          alert(`Failed to delete file with ID ${fileId}`); // Alert for failure
        }
      }
      // Alert for success after all files are deleted
      alert("Files deleted successfully");
    } catch (error) {
      // An error occurred during the request
      console.error("Error deleting files:", error);
      alert("Error deleting files"); // Alert for error
    }
  };

  const handleDownload = async (fileProperties) => {
    try {
      const response = await axios.get(`/download/${fileProperties._id}`, {
        responseType: "blob",
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

  return (
    <div className="drive-container">
      <div>
        <h2 className="file-list-title">Uploaded Files</h2>
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
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default DriveComponent;
