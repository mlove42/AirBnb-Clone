import React, { useState } from "react";
import "../Form.css";

import { useDispatch } from "react-redux";

import InputField from "../../InputField/InputField";
import * as sessionActions from "../../../store/session";

const LoginFormPage = () => {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data?.statusCode) setErrors([data.message]);
      }
    );
  };

  return (
    <div
      className="modal-content login-signup-page-container"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="login-signup-form-container">
        <header className="login-signup-header">Log in</header>
        <form className="login-signup-form" onSubmit={handleSubmit}>
          <div className="login-signup-input-fields">
            <InputField
              type="text"
              className="email-input-field input-field"
              placeholder="Username or Email"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
            <InputField
              type="password"
              className="password-input-field input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <ul className="errors">
            {errors.map((error, id) => (
              <li key={id}>
                <i className="error-icon fa-solid fa-circle-exclamation" />
                {error}
              </li>
            ))}
          </ul>
          <button className="login-submit" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginFormPage;
