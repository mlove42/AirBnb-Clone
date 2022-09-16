const express = require("express");
const router = express.Router();

const sequelize = require("sequelize");

const { restoreUser, requireAuth } = require("../../utils/auth");
const {
  Booking,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
// Get all Spots

router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll({
    include: {
      model: Review,
    },

    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      "previewImage",
      [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
    ],
  });
  res.json({ Spots: spots });
});

// CREATE A SPOT
router.post("/", [requireAuth], async (req, res) => {
  const userId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const spot = await Spot.scope(["defaultScope", "previewExclude"]).create({
    ownerId: userId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201).json(spot);
});

// EDIT A SPOT
router.put("/:spotId", [requireAuth], async (req, res, next) => {
  const spot = await Spot.scope(["defaultScope", "previewExclude"]).findByPk(
    req.params.spotId
  );
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  spot.update({
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price,
  });
  res.json(spot);
});

// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", [restoreUser, requireAuth], async (req, res) => {
  const { url } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);
  const spotImage = await spot.createSpotImage({
    url,
  });
  const SpotImageInfo = await SpotImage.findByPk(spotImage.id, {
    attributes: ["id", "spotId", "url"],
  });
  res.json(SpotImageInfo);
});

// DELETE SPOT
router.delete("/:spotId", [requireAuth], async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  await spot.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
