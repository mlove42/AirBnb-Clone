const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const {
  Booking,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
} = require("../../db/models");
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

module.exports = router;
