import React, { useState } from "react";
import "./Navigation.css";

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import UserOptions from "./UserOptions/UserOptions";
import LoginFormModal from "../Modals/LoginFormModal";
import SignUpFormModal from "../Modals/SignUpFormModal";

const Navigation = ({ isLoaded }) => {
  const [loginModal, setLogInModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  const loginOnClick = () => {
    setLogInModal((loginModal) => !loginModal);
  };

  const signUpOnClick = () => {
    setSignUpModal((signUpModal) => !signUpModal);
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <UserOptions
          user={sessionUser}
          loginOnClick={loginOnClick}
          signUpOnClick={signUpOnClick}
        />
        <LoginFormModal
          showModal={loginModal}
          setShowModal={() => loginModal}
        />
        <SignUpFormModal
          showModal={signUpModal}
          setShowModal={() => signUpModal}
        />
      </>
    );
  }

  return (
    <div
      className="main"
      onClick={
        loginModal === true
          ? loginOnClick
          : signUpModal === true
          ? signUpOnClick
          : null
      }
    >
      <div className="header">
        <div className="header-left">
          <div className="homepage-links" id="homepage-links">
            <NavLink className="homepage-link" id="homepage-link" exact to="/">
              <i className="fa-brands fa-airbnb fa-2x" />
              <p className="homepage-link-name" id="homepage-link-name">
                airbnb
              </p>
            </NavLink>
          </div>
        </div>
        <div className="header-right">{isLoaded && sessionLinks}</div>
      </div>
    </div>
  );
};

export default Navigation;
