import React, { useState } from "react";
import "./CreateSpot.css";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { addNewSpot } from "../../../store/spotsReducer";

const CreateSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSpot = {
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
    dispatch(addNewSpot(newSpot));
    history.push("/");
  };

  return (
    <div className="create-spot-container">
      <div className="create-form-container">
        <button
          className="back-to-home-button"
          onClick={() => history.push("/")}
        >
          Back to Home
        </button>
        <div>
          <h1>Please fill out your listing information</h1>
          <form className="create-spot-form" onSubmit={handleSubmit}>
            <input
              className="create-spot-form-input"
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="text"
              placeholder="State"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="text"
              placeholder="Country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="number"
              placeholder="Latitude"
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="number"
              placeholder="Longitude"
              required
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="text"
              placeholder="Location Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="text"
              placeholder="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="number"
              placeholder="Price"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              className="create-spot-form-input"
              type="input"
              placeholder="Spot Image"
              required
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
            />

            <button className="create-spot-form-button" type="submit">
              Submit Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSpot;
