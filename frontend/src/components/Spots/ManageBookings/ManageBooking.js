import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { deleteBooking } from "../../../store/bookingReducer";
import { getUserBookings } from "../../../store/bookingReducer";
import { getAllBookings } from "../../../store/bookingReducer";
import { loadSpots } from "../../../store/spotsReducer";
const ManageBookings = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const state = useSelector((state) => state);
    const userBookings = useSelector((state) => state.bookings.Bookings);
    console.log(userBookings, "mybooking");
    console.log(state, "THIS IS STATE");
    const deleteBookingOnClick = (bookingId) => {
        dispatch(deleteMySpot(bookingId));
        window.location.reload();
    };
    useEffect(() => {
        dispatch(getUserBookings());
        dispatch(loadSpots());
    }, [dispatch]);
    return (
        <div
        // className="manage-listing"
        // onClick={editListingModal === true ? editListingOnClick : null}
        >
            <section className="manage-listing-container">
                <div className="spot-details-2">
                    <h1>Your Listing Information </h1>
                </div>
                <div className="spot-details-2">
                    <strong> Username: </strong>
                    {sessionUser.username},
                </div>
                <div className="spot-details-2">
                    <strong> User Email: </strong> {" " + sessionUser.email}
                </div>

                <h1 className="no-listing-container">
                    {/* if this is not a spot, display no listings */}
                    {/* {mySpots.length === 0 ? "No Listings Available" : ""} */}
                </h1>
                {/* if there is spot iterating through the array to pull out the data */}

                {userBookings?.length > 0 &&
                    userBookings.map((info, id) => (
                        <div key={id}>
                            <ul>
                                <div className="user-spots-item">
                                    {console.log(info, "info")}
                                    <div className="user-spots-item-img-container">
                                        <img
                                            className="user-spots-item-img"
                                            src={
                                                info.Spot.previewImage
                                                    ? info.Spot.previewImage
                                                    : ""
                                            }
                                            alt={info.Spot.name}
                                        />
                                    </div>
                                    <div className="user-spots-details">
                                        <div className="user-spot-address-container">
                                            <div className="user-spot-name">
                                                Listing Name: {info.Spot.name}
                                            </div>
                                            <div className="user-spot-address">
                                                {" "}
                                                <strong>Address: </strong>{" "}
                                                {info.Spot.address}
                                            </div>
                                            <div className="user-spot-address">
                                                {" "}
                                                <strong>City:</strong>{" "}
                                                {info.Spot.city}
                                            </div>
                                            <div className="user-spot-address">
                                                {" "}
                                                <strong> State: </strong>{" "}
                                                {info.Spot.state}
                                            </div>
                                            <div className="user-spot-address">
                                                {" "}
                                                <strong> Country: </strong>{" "}
                                                {info.Spot.country}
                                            </div>
                                        </div>
                                        <div>
                                            <h1>Booking Dates</h1>
                                            <div>
                                                Start Date: {info.startDate}
                                            </div>
                                            <div>End Date: {info.endDate}</div>
                                        </div>
                                        <div className="user-spot-edit-container">
                                            {/* <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editListingOnClick(spot.id)
                                                }
                                            >
                                                Edit Listing
                                            </button> */}
                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteListingOnClick(
                                                        info.id
                                                    )
                                                }
                                            >
                                                Delete Listing
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    ))}
            </section>
        </div>
    );
};

export default ManageBookings;
