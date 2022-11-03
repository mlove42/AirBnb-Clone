import React, { useState } from "react";
import "./SignUpForm.css";
import "../Form.css";

import { useDispatch } from "react-redux";

import InputField from "../../InputField/InputField";
import * as sessionActions from "../../../store/session";

const SignupFormPage = () => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({
          firstName,
          lastName,
          email,
          username,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors([data.errors]);
      });
    }
    return setErrors([
      {
        passwordMismatchErr:
          "Confirm Password field must be the same as the Password field",
      },
    ]);
  };

  return (
    <div
      className="signup-form-height modal-content login-signup-page-container"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="login-signup-form-container">
        <header className="login-signup-header">Sign Up</header>

        <form className="login-signup-form" onSubmit={handleSubmit}>
          <div className="login-signup-input-fields">
            <InputField
              type="text"
              className="email-input-field input-field"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
              type="text"
              className="center-input-field input-field"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <InputField
              type="text"
              className="center-input-field input-field"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <InputField
              type="text"
              className="center-input-field input-field"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              type="password"
              className="center-input-field input-field"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
              type="password"
              className="password-input-field input-field"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <ul className="errors">
            {errors.map((error, id) => (
              <li key={id}>
                <i className="error-icon fa-solid fa-circle-exclamation" />
                {error?.passwordMismatchErr ||
                  error?.email ||
                  error?.username ||
                  error?.password}
              </li>
            ))}
          </ul>
          <button className="login-submit" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupFormPage;
