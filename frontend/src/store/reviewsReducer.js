import { csrfFetch } from "./csrf";
//! action types
const ADD_REVIEW = "spots/ADD_REVIEW";
const GET_SPOT_REVIEWS = "spots/GET_SPOT_REVIEWS";
const DELETE_REVIEW = "spots/DELETE_REVIEW";
const EDIT_REVIEW = "spots/EDIT_REVIEW";

//! action creatorS
export const addReview = (review) => {
  return {
    type: ADD_REVIEW,
    review,
  };
};

export const getSpotReviews = (spotReviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    spotReviews,
  };
};

export const deleteReview = (review) => {
  return {
    type: DELETE_REVIEW,
    review,
  };
};

export const editReview = (review) => {
  return {
    type: EDIT_REVIEW,
    review,
  };
};

//! thunk creators
export const addNewReview = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(addReview(review));
  }
};

export const getSelectedSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const spotReviews = await response.json();
  dispatch(getSpotReviews(spotReviews));
};

export const deleteMyReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteReview(data));
  }
};

export const editMyReview =
  (reviewId, editedReviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedReviewData),
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(editReview(data));
    }
  };

//! spot Reducer
const initialState = {
  spotReviews: [],
  mySpotReviews: [],
};

const reviewsReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ADD_REVIEW:
      newState[action.review.id] = action.review;
      return newState;
    case GET_SPOT_REVIEWS:
      return action.spotReviews;
    case DELETE_REVIEW:
      newState[action.review.id] = action.review;
      return newState;
    case EDIT_REVIEW:
      newState[action.review.id] = action.review;
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
