import React, { useState } from "react";
import "./EditListingForm.css";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { editSpotThunk, loadSpots } from "../../../store/spotsReducer";

const EditListingFormPage = ({
  addressInitialValue,
  cityInitialValue,
  stateInitialValue,
  countryInitialValue,
  latInitialValue,
  lngInitialValue,
  nameInitialValue,
  descriptionInitialValue,
  priceInitialValue,
  previewImageInitialValue,
  id,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [address, setAddress] = useState(addressInitialValue);
  const [city, setCity] = useState(cityInitialValue);
  const [state, setState] = useState(stateInitialValue);
  const [country, setCountry] = useState(countryInitialValue);
  const [lat, setLat] = useState(latInitialValue);
  const [lng, setLng] = useState(lngInitialValue);
  const [name, setName] = useState(nameInitialValue);
  const [description, setDescription] = useState(descriptionInitialValue);
  const [price, setPrice] = useState(priceInitialValue);
  const [previewImage, setImage] = useState(
    previewImageInitialValue ? previewImageInitialValue : ""
  );

  let spotId = id;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      previewImage,
    };
    dispatch(editSpotThunk(spotId, updatedSpot));
    dispatch(loadSpots());
    history.push("/");
  };

  return (
    <div
      className="edit-listing-form-height modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="edit-spot-container">
        <form className="edit-spot-form" onSubmit={handleSubmit}>
          <header className="edit-spot-header">Edit Your Listing</header>
          <div className="edit-spot-input-field-container">
            <label className="edit-spot-input-field-label" htmlFor="address">
              Address:
            </label>
            <input
              type="text"
              name="address"
              required
              className="edit-spot-form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label className="edit-spot-input-field-label" htmlFor="city">
              City:
            </label>
            <input
              type="text"
              name="city"
              required
              className="edit-spot-form-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label className="edit-spot-input-field-label" htmlFor="state">
              State:
            </label>
            <input
              type="text"
              name="state"
              required
              className="edit-spot-form-input"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label className="edit-spot-input-field-label" htmlFor="country">
              Country:
            </label>
            <input
              type="text"
              name="country"
              required
              className="edit-spot-form-input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label className="edit-spot-input-field-label" htmlFor="lat">
              Latitude:
            </label>
            <input
              type="number"
              name="lat"
              required
              className="edit-spot-form-input"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label className="edit-spot-input-field-label" htmlFor="lng">
              Longitude:
            </label>
            <input
              type="number"
              name="lng"
              required
              className="edit-spot-form-input"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label className="edit-spot-input-field-label" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              name="name"
              required
              className="edit-spot-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label
              className="edit-spot-input-field-label"
              htmlFor="description"
            >
              Description:
            </label>
            <input
              type="text"
              name="description"
              required
              className="edit-spot-form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label className="edit-spot-input-field-label" htmlFor="price">
              Price:
            </label>
            <input
              type="number"
              name="price"
              required
              className="edit-spot-form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="edit-spot-input-field-container">
            <label
              className="edit-spot-input-field-label"
              htmlFor="previewImage"
            >
              Image URL:
            </label>
            <input
              type="input"
              name="previewImage"
              required
              className="edit-spot-form-input"
              value={previewImage}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <ul className="edit-spot-errors"></ul>
        </form>
        <button
          className="edit-spot-form-button"
          onClick={(e) => handleSubmit(e)}
        >
          Edit Listing
        </button>
      </div>
    </div>
  );
};

export default EditListingFormPage;
