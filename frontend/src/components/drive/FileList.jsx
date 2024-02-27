import React from "react";
import "./Drive.css"; // Import CSS file for styling

const FileList = ({ files, handleDownload }) => {
  return (
    <div className="file-list-container">
      <h2 className="file-list-title">Uploaded Files</h2>
      <table className="file-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Size</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.name}</td>
              <td>{file.date}</td>
              <td>{file.size}</td>
              <td>
                <button
                  className="download-btn"
                  onClick={() => handleDownload(file.file)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
