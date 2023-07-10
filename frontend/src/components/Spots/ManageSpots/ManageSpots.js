import React, { useState, useEffect } from "react";
import "./ManageSpots.css";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import EditListingFormModal from "../../Modals/EditListingFormModal";

import { deleteMySpot } from "../../../store/spotsReducer";
import { loadMySpots } from "../../../store/spotsReducer";

const ManageSpots = () => {
    const [editListingModal, setEditListingModal] = useState(false);
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const mySpots = useSelector((state) => state.spotsState);
    console.log(mySpots, "MY SPOTS");
    const [selectedEditSpot, setSelectedEditModal] = useState();

    const editListingOnClick = (spotId) => {
        setEditListingModal((editListingModal) => !editListingModal);
        const selectedEditSpotObj = mySpots.filter(
            (spot) => spot.id === spotId
        );
        setSelectedEditModal(selectedEditSpotObj);
    };

    const deleteListingOnClick = (spotId) => {
        dispatch(deleteMySpot(spotId));
        window.location.reload();
    };
    // console.log("test", selectedEditSpot);

    // setting the existing values to add to the form of an existing spot

    // selectedEditSpot is an array, if the array has value and the first index has a value, then we are going to set the form field to the specific value

    const initialAddressValue =
        selectedEditSpot && selectedEditSpot[0]?.address;
    const initialCityValue = selectedEditSpot && selectedEditSpot[0]?.city;
    const initialStateValue = selectedEditSpot && selectedEditSpot[0]?.state;
    const initialCountryValue =
        selectedEditSpot && selectedEditSpot[0]?.country;
    const initialLatValue = selectedEditSpot && selectedEditSpot[0]?.lat;
    const initialLngValue = selectedEditSpot && selectedEditSpot[0]?.lng;
    const initialNameValue = selectedEditSpot && selectedEditSpot[0]?.name;
    const initialDescriptionValue =
        selectedEditSpot && selectedEditSpot[0]?.description;
    const initialPriceValue = selectedEditSpot && selectedEditSpot[0]?.price;
    const initialPreviewImageValue =
        selectedEditSpot && selectedEditSpot[0]?.previewImage;

    useEffect(() => {
        dispatch(loadMySpots());
    }, [dispatch]);

    return (
        <div
            className="manage-listing"
            onClick={editListingModal === true ? editListingOnClick : null}
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
                    {mySpots.length === 0 ? "No Listings Available" : ""}
                </h1>
                {/* if there is spot iterating through the array to pull out the data */}

                {mySpots?.length > 0 &&
                    mySpots.map((spot, id) => (
                        <div key={id}>
                            <ul>
                                <div className="user-spots-item">
                                    <div className="user-spots-item-img-container">
                                        <img
                                            className="user-spots-item-img"
                                            src={
                                                spot.previewImage
                                                    ? spot.previewImage
                                                    : ""
                                            }
                                            alt={spot.name}
                                        />
                                    </div>
                                    <div className="user-spots-details">
                                        <div className="user-spot-address-container">
                                            <div className="user-spot-name">
                                                Listing Name: {spot.name}
                                            </div>
                                            <div className="user-spot-address">
                                                {" "}
                                                <strong>Address: </strong>{" "}
                                                {spot.address}
                                            </div>
                                            <div className="user-spot-address">
                                                {" "}
                                                <strong>City:</strong>{" "}
                                                {spot.city}
                                            </div>
                                            <div className="user-spot-address">
                                                {" "}
                                                <strong> State: </strong>{" "}
                                                {spot.state}
                                            </div>
                                            <div className="user-spot-address">
                                                {" "}
                                                <strong> Country: </strong>{" "}
                                                {spot.country}
                                            </div>
                                        </div>

                                        <div className="user-spot-edit-container">
                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editListingOnClick(spot.id)
                                                }
                                            >
                                                Edit Listing
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteListingOnClick(
                                                        spot.id
                                                    )
                                                }
                                            >
                                                Delete Listing
                                            </button>
                                        </div>
                                    </div>
                                    <EditListingFormModal
                                        showModal={editListingModal}
                                        setShowModal={() => editListingModal}
                                        addressInitialValue={
                                            initialAddressValue
                                        }
                                        cityInitialValue={initialCityValue}
                                        stateInitialValue={initialStateValue}
                                        countryInitialValue={
                                            initialCountryValue
                                        }
                                        latInitialValue={initialLatValue}
                                        lngInitialValue={initialLngValue}
                                        nameInitialValue={initialNameValue}
                                        descriptionInitialValue={
                                            initialDescriptionValue
                                        }
                                        priceInitialValue={initialPriceValue}
                                        previewImageInitialValue={
                                            initialPreviewImageValue
                                        }
                                        id={spot.id}
                                    />
                                </div>
                            </ul>
                        </div>
                    ))}
            </section>
        </div>
    );
};

export default ManageSpots;
