import React from "react";
import "./Footer.css";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer-container">
      <Link className="about-link" to="/">
        About
      </Link>
    </div>
  );
};

export default Footer;
