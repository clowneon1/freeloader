import React from "react";

const FileList = ({ files, uploadProgress, handleRemoveFile }) => {
  return (
    <div className="file-list-container">
      <h2 className="file-list-title">Files to upload</h2>
      <table className="file-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Size</th>
            <th>Progress</th>
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
                <progress
                  value={uploadProgress[index]?.progress || 0}
                  max="100"
                />
              </td>
              <td>
                <button
                  onClick={() => handleRemoveFile(index)}
                  disabled={uploadProgress[index]?.progress !== undefined} // Disable if there is progress
                >
                  Remove
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
