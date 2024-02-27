// Header.js
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <Link to="/" className="logo">
        Freeloader👀
      </Link>
      <nav className="nav-links">
        <Link to="/">Drive</Link>
        <Link to="/upload">Upload</Link>
      </nav>
    </div>
  );
};

export default Header;
