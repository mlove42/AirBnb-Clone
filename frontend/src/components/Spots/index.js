import React, { useEffect } from "react";
import "./index.css";

import { useDispatch, useSelector } from "react-redux";
import { loadSpots } from "../../store/spotsReducer";
import { NavLink } from "react-router-dom";

import { getSelectedSpot } from "../../store/spotsReducer";
import { getSelectedSpotReviews } from "../../store/reviewsReducer";

const Spots = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spotsState);

  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch]);

  return (
    <div className="spots-preview-container">
      <ul className="spots-preview">
        {Object.keys(spots)?.map((spotId) => {
          return (
            <NavLink
              // once the user click on the photo get the spot by the spot ID

              to={`/spots/${spotId}`}
              className="spot-preview"
              key={spotId}
              onClick={() => {
                dispatch(getSelectedSpot(spotId));
                dispatch(getSelectedSpotReviews(spotId));
              }}
            >
              {spots[spotId]?.previewImage ? (
                <img
                  className="spot-img"
                  src={spots[spotId].previewImage}
                  alt={spots[spotId].name}
                />
              ) : (
                <div>{spots[spotId]?.name}</div>
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
