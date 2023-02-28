import React, { useState, useEffect } from "react";
import "./UserOptions.css";

import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import BecomeHost from "../Buttons/BecomeHost/BecomeHost";
import * as sessionActions from "../../../store/session";

function ProfileButton({ user, loginOnClick, signUpOnClick }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;
        const closeMenu = () => {
            setShowMenu(false);
        };
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        history.push("/");
    };

    return (
        <div className="user-options-container">
            {/* if user sign in display Become a host, if not display nothing  */}
            {sessionUser?.email ? <BecomeHost /> : ""}
            <div className="profile-button-container">
                <button className="profile-button" onClick={openMenu}>
                    <div className="profile-button-icons">
                        <i className="hamburger-icon fa-solid fa-bars" />
                        <i className="fa-solid fa-user-large" />
                    </div>
                </button>
                {showMenu && (
                    <div className="profile-button-menu">
                        <button
                            className="user-option"
                            onClick={
                                !user?.username
                                    ? loginOnClick
                                    : () =>
                                          history.push("/manage-listings/spots")
                            }
                        >
                            {user?.username ? "Manage Listing" : "Log In"}
                        </button>
                        {!user?.email && (
                            <>
                                <button
                                    className="user-option"
                                    onClick={signUpOnClick}
                                >
                                    Sign Up
                                </button>
                                <button
                                    className="demo-option"
                                    onClick={async (e) => {
                                        const credential = "demo@user.io";
                                        const password = "password";
                                        // history.push("/");

                                        // const data = await dispatch(login(email, password));
                                        const data = await dispatch(
                                            sessionActions.login({
                                                credential,
                                                password,
                                            })
                                        );
                                        if (data) history.push("/");
                                    }}
                                >
                                    Demo User
                                </button>
                            </>
                        )}
                        {user?.username && (
                            <button className="user-option" onClick={logout}>
                                Log Out
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
