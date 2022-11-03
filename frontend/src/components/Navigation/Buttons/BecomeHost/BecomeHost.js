import React from "react";
import "../index.css";

import { useHistory } from "react-router-dom";

const BecomeHost = () => {
  const history = useHistory();
  return (
    <button
      className="common-profile-option-btn"
      onClick={() => history.push("/create-spot")}
    >
      Become a host
    </button>
  );
};

export default BecomeHost;
