import React, { useEffect } from "react";
import "./index.css";

import { useDispatch, useSelector } from "react-redux";
import { loadSpots } from "../../store/spotsReducer";
import { NavLink } from "react-router-dom";

import { getSelectedSpot } from "../../store/spotsReducer";
import { getSelectedSpotReviews } from "../../store/reviewsReducer";

const Spots = () => {
  const dispatch = useDispatch();
  // use useSelector to extra data from the spot store
  const spots = useSelector((state) => state.spotsState);

  // spots = spots' data

  // using useEffect to have the page load the spots after each render
  useEffect(() => {
    //dispatch the loadSpots action creator to the store
    dispatch(loadSpots());
  }, [dispatch]);

  return (
    <div className="spots-preview-container">
      <ul className="spots-preview">
        {/* iteratore over the spots array to pull out each piece of data needed for the componenet */}
        {Object.keys(spots)?.map((spotId) => {
          return (
            <NavLink
              // once the user click on the photo get the spot by the spot ID

              to={`/spots/${spotId}`}
              className="spot-preview"
              key={spotId}
              onClick={() => {
                // once we click on the navLink we are going to load the "get spot by Id data from the backend api and the get reviews by spot Id backend api "
                dispatch(getSelectedSpot(spotId));
                dispatch(getSelectedSpotReviews(spotId));
              }}
            >
              {/* if there is a previewImage do this */}
              {spots[spotId]?.previewImage ? (
                <img
                  className="spot-img"
                  src={spots[spotId].previewImage}
                  alt={spots[spotId].name}
                />
              ) : (
                //  if not do this
                <div className="spot-img-box">{spots[spotId]?.name}</div>
              )}

              <div className="spot-details-container">
                <div className="spot-details" style={{ marginTop: "-15px" }}>
                  <strong>
                    <p className="spot-location">{`${spots[spotId]?.city}, ${spots[spotId]?.state}`}</p>
                  </strong>
                  {spots[spotId]?.name && (
                    <p className="spot-name" style={{ marginTop: "-10px" }}>
                      {spots[spotId]?.name}
                    </p>
                  )}
                </div>
                <div className="spot-price" style={{ marginTop: "-10px" }}>
                  <strong>{`$${spots[spotId]?.price}`}</strong>
                </div>
              </div>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};

export default Spots;
