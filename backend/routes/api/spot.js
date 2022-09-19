const express = require("express");
const router = express.Router();

const sequelize = require("sequelize");

const { restoreUser, requireAuth } = require("../../utils/auth");
const {
  User,
  Booking,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const spotValidation = async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (spot) {
    next();
  } else {
    const error = new Error("Spot couldn't be found");
    error.status = 404;

    next(error);
  }
};
///////////////////////////////////
// valdiate the spot attributes middleware
const validateSpotAttributes = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat").exists({ checkFalsy: true }).withMessage("Latitude is required"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is required"),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name must be less than 50 characters")
    .isLength({ max: 50 }),

  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];
/////////////////////////
// SPOT AUTHORIZATION MIDDLEWARE
const AuthorizationSpot = async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const user = req.user;
  if (spot.ownerId === user.id) {
    return next();
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
};
//////////////////////////////////////////////

// Get all Spots
router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll({
    include: {
      model: Review,
      attributes: [],
    },
    group: ["Spot.id"],
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
      [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      "previewImage",
    ],
  });
  res.json({ Spots: spots });
});

// CREATE A SPOT

router.post("/", [requireAuth, validateSpotAttributes], async (req, res) => {
  const userId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const spot = await Spot.create({
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
  const newSpot = spot.toJSON();
  Object.keys(newSpot).forEach(
    (value) => newSpot[value] == null && delete newSpot[value]
  );
  res.status(201).json(newSpot);
});

// EDIT A SPOT
router.put(
  "/:spotId",
  [requireAuth, validateSpotAttributes, spotValidation],
  async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
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
  }
);

// Add an Image to a Spot based on the Spot's id

router.post(
  "/:spotId/images",
  [restoreUser, requireAuth, spotValidation, AuthorizationSpot],
  async (req, res) => {
    const { url } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    const spotImage = await spot.createSpotImage({
      url,
    });
    const SpotImageInfo = await SpotImage.findByPk(spotImage.id, {
      attributes: ["id", "url", "preview"],
    });
    res.json(SpotImageInfo);
  }
);

// Get details of a Spot from an id
router.get("/:spotId", [spotValidation], async (req, res, next) => {
  const id = Number(req.params.spotId);
  const spot = await Spot.findOne({
    where: { id },
    // raw: true,
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
    ],
    include: [
      {
        model: Review,
        attributes: [],
      },

      {
        model: SpotImage,
        // as: "spotImage",
        attributes: ["id", "url", "preview"],
        group: "'SpotImage'.'id'",
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  const stat = await Review.findOne({
    where: { spotId: id },
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("id")), "numReviews"],
      [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
    ],
  });

  // res.json(stat);
  console.log(stat);
  spot.dataValues.numReviews = stat.dataValues.numReviews;
  spot.dataValues.avgStarRating = stat.dataValues.avgStarRating;
  // console.log(spot);
  res.json(spot);
});

// DELETE SPOT
router.delete(
  "/:spotId",
  [restoreUser, requireAuth, spotValidation, AuthorizationSpot],
  async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    await spot.destroy();

    res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  }
);

module.exports = router;
