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

  // console.log("spot", location.pathname.length);
  //check if the location has data and the the path has data, then return the string which will be the spotId
  const spotId = location?.pathname?.substring(7, location.pathname.length);
  // console.log(spotId)
  // let rating2Decimal = spot.avgStarRating;
  // console.log("test", addNewReview);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      userId,
      review,
      stars,
    };

    {
      // thunks always take in the same arguments as when we create the thunk
      dispatch(addNewReview(spotId, reviewData));
      dispatch(getSelectedSpotReviews(spotId));
      setActionToggled((actionToggled) => !actionToggled);
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
    console.log("insider use effect");
    dispatch(getSelectedSpotReviews(spotId));
    dispatch(getSelectedSpot(spotId));
  }, [dispatch, actionToggled]);

  // console.log(spot.SpotImages);

  return (
    <>
      <div className="spot-detail-main">
        <div className="spot-section">
          <div className="spot-name">
            <h1>{spot?.name}</h1>
          </div>
          <div className="spot-description">
            <div>
              <strong>Location: </strong> {spot?.city}, {spot?.state}
            </div>
          </div>
          <div className="spot-rating">
            <i className="fa-solid fa-star"></i>
            {spot?.avgStarRating || "Be the first to Review"}
          </div>
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
              <form className="user-review-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                />
                <label className="stars-label" htmlFor="stars">
                  Stars
                </label>
                <input
                  className="general-input"
                  type="number"
                  placeholder="Stars"
                  value={stars}
                  onChange={(e) => setStars(e.target.value)}
                  min="1"
                  max="5"
                  required
                />
                <button type="submit">Submit Review</button>
              </form>
            ) : (
              <div>
                <div>
                  <div>Please log in to submit a review.</div>
                  <div className="login-button">
                    <button
                      className="header-login-button"
                      onClick={() => history.push("/login")}
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* if the review exist */}
          {/* {console.log("reviews", reviews)} */}
          {reviews?.map((review) => (
            <div className="other-reviews-container">
              {review?.User?.id === userId && (
                <>
                  <Link
                    className="delete-icon fa-solid fa-pen-to-square"
                    to={`/spots/${spotId}`}
                    onClick={() => {
                      setEditState((editState) => !editState);
                      setReviewId(review.id);
                    }}
                  />
                  <Link
                    className="delete-icon fa-solid fa-trash"
                    to={`/spots/${spotId}`}
                    onClick={() => {
                      dispatch(deleteMyReview(review.id));
                      setActionToggled((actionToggled) => !actionToggled);
                    }}
                  />
                </>
              )}

              {editState === true ? (
                <form className="user-review-form" onSubmit={handleReviewEdit}>
                  <input
                    className="general-input"
                    type="text"
                    placeholder="Review"
                    value={editReview}
                    onChange={(e) => setEditReview(e.target.value)}
                    required
                  />
                  <label className="stars-label" htmlFor="editStars">
                    Stars
                  </label>
                  <input
                    className="general-input"
                    type="number"
                    placeholder="Stars"
                    value={editStars}
                    onChange={(e) => setEditStars(e.target.value)}
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
