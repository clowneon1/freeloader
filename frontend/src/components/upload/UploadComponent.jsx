import React, { useState } from "react";
import UploadFileList from "./UploadFileList";
import "./UploadComponent.css";
import axios from "../../api/axiosConfig"; // Import Axios for making HTTP requests

const UploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadProgress, setUploadProgress] = useState([]);
  const GB_CONVERSION = 1000000000;
  const MB_CONVERSION = 1000000;
  const KB_CONVERSION = 1000;

  const handleFileUpload = (event) => {
    const uploadedFiles = event.target.files;
    const newFiles = [];
    const fileNamesSet = new Set(files.map((file) => file.name)); // Set of existing file names

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      if (!fileNamesSet.has(file.name)) {
        // Check if file is not already in the list
        let fileSize;
        if (file.size >= GB_CONVERSION) {
          fileSize = `${(file.size / GB_CONVERSION).toFixed(2)} GB`;
        } else if (file.size >= MB_CONVERSION) {
          fileSize = `${(file.size / MB_CONVERSION).toFixed(2)} MB`;
        } else if (file.size >= KB_CONVERSION) {
          fileSize = `${(file.size / KB_CONVERSION).toFixed(2)} KB`;
        } else {
          fileSize = `${file.size} bytes`;
        }

        newFiles.push({
          name: file.name,
          date: new Date().toLocaleDateString(),
          size: fileSize,
          file,
        });
      }
    }

    setFiles([...files, ...newFiles]);
    setTotalFiles(totalFiles + newFiles.length);
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    setTotalFiles(updatedFiles.length);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file.file);
    });

    const progressBars = files.map(() => ({
      progress: 0,
    }));
    setUploadProgress(progressBars);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded / total) * 100);

          setUploadProgress((prevProgress) =>
            prevProgress.map((item) => ({
              progress,
            }))
          );
        },
      });
      console.log(response.data);
      setFiles([]);
      setTotalFiles(0);
      setUploadProgress([]);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = ""; // Clear the file input field
        fileInput.dispatchEvent(new Event("change")); // Manually trigger the change event
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadProgress([]);
    }
  };

  return (
    <div>
      <label htmlFor="upload" className="upload-container">
        <span>Choose files</span>
      </label>
      <span className="total-files">Total files: {totalFiles}</span>
      <input
        id="upload"
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        multiple
      />
      <UploadFileList
        files={files}
        uploadProgress={uploadProgress}
        handleRemoveFile={handleRemoveFile}
      />
      <button className="upload-container" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default UploadComponent;
