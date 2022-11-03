import { csrfFetch } from "./csrf";

//! action types
const LOAD_SPOTS = "spots/LOAD";
const LOAD_MY_SPOTS = "spots/LOAD_MY_SPOTS";
const ADD_SPOT = "spots/ADD";
const EDIT_SPOT = "spots/EDIT";
const DELETE_SPOT = "spots/DELETE";
const GET_SPOT = "spots/GET_SPOT";

//! action creators
export const load = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots,
  };
};

export const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot,
  };
};

export const editSpot = (spot) => {
  return {
    type: EDIT_SPOT,
    spot,
  };
};

export const deleteSpot = (spot) => {
  return {
    type: DELETE_SPOT,
    spot,
  };
};

export const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    spot,
  };
};

//! thunk creators
export const loadSpots = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`);
  const spots = await response.json();
  const spotsObj = {};

  spots.forEach((spot) => {
    spotsObj[spot.id] = spot;
  });

  dispatch(load(spotsObj));
};

export const loadMySpots = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`);
  const mySpots = await response.json();
  dispatch(load(mySpots.Spots));
};

export const addNewSpot = (spotData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });
  if (response.ok) {
    const spot = await response.json();
    dispatch(addSpot(spot));
  }
};

export const editSpotThunk = (spotId, spotData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(editSpot(data));
  }
};

export const deleteMySpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteSpot(data));
  }
};

export const getSelectedSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(getSpot(data));
  }
};

//! spot Reducer

const initialState = {};

const spotsReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case LOAD_SPOTS:
      return action.spots;
    case LOAD_MY_SPOTS:
      return action.mySpots;
    case GET_SPOT:
      return action.spot;
    case ADD_SPOT:
      newState[action.spot.id] = action.spot;
      return newState;
    case EDIT_SPOT:
      const spot = newState[action.spot.id];
      spot.address = action.spot.address;
      spot.city = action.spot.city;
      spot.country = action.spot.country;
      spot.lat = action.spot.lat;
      spot.lng = action.spot.lng;
      spot.name = action.spot.name;
      spot.description = action.spot.description;
      spot.price = action.spot.price;
      break;
    case DELETE_SPOT:
      newState[action.spot.id] = action.spot;
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
