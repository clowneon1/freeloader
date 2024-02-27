import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
// import "./App.css";

import UploadComponent from "./components/upload/UploadComponent";
import DriveComponent from "./components/drive/DriveComponent";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<DriveComponent />} />
        <Route path="/upload" element={<UploadComponent />} />
      </Route>
    </Routes>
  );
};

export default App;
