import React, { useState, useEffect } from "react";
import "./index.css";

import { useHistory, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
    addNewReview,
    getSelectedSpotReviews,
    deleteMyReview,
    editMyReview,
} from "../../../store/reviewsReducer";
import { getSelectedSpot } from "../../../store/spotsReducer";

const ViewSpots = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const spot = useSelector((state) => state.spotsState);
    const reviews = useSelector((state) => state.reviews?.Reviews);
    const sessionUser = useSelector((state) => state.session.user);
    let userId = sessionUser && sessionUser.id;
    // console.log("Spot", spot);
    // const spotImg = localStorage.getItem("selectedSpotUrl");
    const history = useHistory();
    // console.log("location", location);
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const [editReview, setEditReview] = useState("");
    const [editStars, setEditStars] = useState(0);
    const [actionToggled, setActionToggled] = useState();
    const [editState, setEditState] = useState(false);
    const [reviewId, setReviewId] = useState("");
    const [errors, setErrors] = useState([]);

    // console.log("spot", location.pathname.length);
    //check if the location has data and the the path has data, then return the string which will be the spotId
    const spotId = location?.pathname?.substring(7, location.pathname.length);
    // console.log(spotId)
    // let rating2Decimal = spot.avgStarRating;
    // console.log("test", addNewReview);
    const spotReviews = useSelector((state) => state.reviews.Reviews);

    // console.log(spotReviews, "SPOT REVIEWS");
    // console.log(sessionUser.id, "SESSION UNION");
    //   const comments = useSelector((state) => {
    //     return Object.values(state.comment);
    // });

    const userReview = spotReviews?.filter(
        (review) => review?.userId === sessionUser?.id
    );

    // console.log(userReview, "USER REVIEW");
    const handleSubmit = (e) => {
        e.preventDefault();
        const reviewData = {
            userId,
            review,
            stars,
        };
        setReview("");
        setStars("");
        {
            // thunks always take in the same arguments as when we create the thunk
            dispatch(addNewReview(spotId, reviewData));
        }
    };

    const handleReviewEdit = (e) => {
        e.preventDefault();

        const editedReviewData = {
            review: editReview,
            stars: editStars,
        };

        {
            dispatch(editMyReview(reviewId, editedReviewData));
            setEditState((editState) => !editState);
            setActionToggled((actionToggled) => !actionToggled);
        }
    };

    useEffect(() => {
        dispatch(getSelectedSpotReviews(spotId));
        dispatch(getSelectedSpot(spotId));
    }, [dispatch, actionToggled, errors]);

    // console.log(spot.SpotImages);
    // console.log(errors, "ERRORS RIGHT HERE");
    return (
        <>
            <div className="spot-detail-main">
                <div className="spot-section">
                    <div className="spot-name">
                        <h1>{spot?.name}</h1>
                    </div>
                    <div className="spot-description">
                        <div>
                            <strong>Location: </strong> {spot?.city},{" "}
                            {spot?.state}
                        </div>
                    </div>
                    {/* <div className="spot-rating">
            <i className="fa-solid fa-star"></i>
            {spot?.avgStarRating || "Be the first to Review"}
          </div> */}
                    <div className="spot-header-image">
                        <img src={spot.previewImage} alt={spot.name} />
                    </div>
                </div>
                <div className="review-section">
                    <div className="review-header">
                        <h2>Leave a review</h2>
                    </div>

                    <div className="user-review">
                        {/* {console.log("sesssionUser", sessionUser)} */}

                        {/* if sessionUser exist allow for the user to give a review */}

                        {sessionUser?.username ? (
                            <>
                                <form
                                    className="user-review-form"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        type="text"
                                        placeholder="Review"
                                        value={review}
                                        onChange={(e) =>
                                            setReview(e.target.value)
                                        }
                                        required
                                    />
                                    <label
                                        className="stars-label"
                                        htmlFor="stars"
                                    >
                                        Stars
                                    </label>
                                    <input
                                        className="general-input"
                                        type="number"
                                        placeholder="Stars"
                                        value={stars}
                                        onChange={(e) =>
                                            setStars(e.target.value)
                                        }
                                        min="1"
                                        max="5"
                                        required
                                    />

                                    <button type="submit">Submit Review</button>
                                    <div className="errors">
                                        {Object.values(errors).map(
                                            (error, i) => {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="error"
                                                    >
                                                        <li>{error}</li>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div>
                                <div>
                                    <div>Please log in to submit a review.</div>
                                    <div className="login-button">
                                        <button
                                            className="header-login-button"
                                            onClick={() =>
                                                history.push("/login")
                                            }
                                        >
                                            Log In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* <div>{errors.message}</div> */}
                    </div>
                    {/* if the review exist */}
                    {/* {console.log("reviews", reviews)} */}

                    {reviews?.map((review) => (
                        <div
                            key={review.id}
                            className="other-reviews-container"
                        >
                            {/* {console.log(review)} */}
                            {review?.User?.id === userId && (
                                <>
                                    <Link
                                        className="delete-icon fa-solid fa-pen-to-square"
                                        to={`/spots/${spotId}`}
                                        onClick={() => {
                                            setEditState(
                                                (editState) => !editState
                                            );
                                            setReviewId(review.id);
                                        }}
                                    />
                                    <Link
                                        className="delete-icon fa-solid fa-trash"
                                        to={`/spots/${spotId}`}
                                        onClick={() => {
                                            dispatch(deleteMyReview(review.id));
                                            dispatch(
                                                getSelectedSpotReviews(spotId)
                                            );
                                            setActionToggled(
                                                (actionToggled) =>
                                                    !actionToggled
                                            );
                                        }}
                                    />
                                </>
                            )}
                            {userId == review.userId && editState === true ? (
                                <form
                                    className="user-review-form"
                                    onSubmit={handleReviewEdit}
                                >
                                    <input
                                        className="general-input"
                                        type="text"
                                        placeholder="Review"
                                        value={editReview}
                                        onChange={(e) =>
                                            setEditReview(e.target.value)
                                        }
                                        required
                                    />
                                    <label
                                        className="stars-label"
                                        htmlFor="editStars"
                                    >
                                        Stars
                                    </label>
                                    <input
                                        className="general-input"
                                        type="number"
                                        placeholder="Stars"
                                        value={editStars}
                                        onChange={(e) =>
                                            setEditStars(e.target.value)
                                        }
                                        min="1"
                                        max="5"
                                        required
                                    />
                                    <button type="submit">Save Changes</button>
                                </form>
                            ) : (
                                <div className="other-review-container">
                                    <div className="reviewer-name">
                                        Name:{" " + review?.User?.firstName}{" "}
                                        {review?.User?.lastName}
                                    </div>
                                    <div className="review-stars">
                                        Ratings: {" " + review?.stars}
                                    </div>
                                    <div className="review-review">
                                        Comment: {" " + review?.review}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ViewSpots;
