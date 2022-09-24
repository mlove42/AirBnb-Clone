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

const { check, query } = require("express-validator");
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
//! valdiate the spot attributes middleware
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
//! spot authorization middleware
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
//* GET ALL SPOTS

router.get("/", async (req, res, next) => {
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
  let limit;
  let offset;
  if (!page && !size) {
    const all = await Spot.findAll();
    return res.json(all);
  }
  if (page >= 1 && size >= 1) {
    limit = size;
    offset = size * (page - 1);
  }
  const spot = await Spot.findAll({
    limit: size,
    offset: size * (page - 1),
  });
  return res.json({
    spot,
    page,
    size,
  });
});

//* Get all Spots
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
      // [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      "previewImage",
    ],
  });
  res.json({ Spots: spots });
});

/////////////////////////////////////////////
//* Get all Spots owned by the Current User
router.get("/current", [restoreUser, requireAuth], async (req, res) => {
  const { user } = req;
  const spots = await Spot.findAll({
    where: { ownerId: user.id },
    include: {
      model: SpotImage,
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
      [sequelize.fn("max", sequelize.col("SpotImages.url")), "previewImage"],
    ],
  });
  res.json({ Spots: spots });
});

//* Create a spot

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

//* Edit a Spot
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
    await spot.update({
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
    const updated = await Spot.findByPk(req.params.spotId, {
      attributes: {
        exclude: ["previewImage"],
        include: ["createdAt", "updatedAt"],
      },
    });
    // res.json(updated);

    // newUpdated = await Spot.findByPk(req.params.spotId);

    // newUpdated = spot.toJSON();
    // Object.keys(newUpdated).forEach((value) => {
    //   console.log(value);
    //   newUpdated[value] == null && delete newUpdated[value];
    // });

    // const removeUpdatedAt = await Spot.findByPk(req.params.spotId);

    res.status(201).json(updated);
  }
);

//* Add an Image to a Spot based on the Spot's id

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
      attributes: ["id", "spotId", "url"],
    });
    res.json(SpotImageInfo);
  }
);

//* Get details of a Spot from an id
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
        attributes: ["url"],
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
  // console.log(stat);
  // spot.dataValues.numReviews = stat.dataValues.numReviews;
  // spot.dataValues.avgStarRating = stat.dataValues.avgStarRating;
  // console.log(spot);
  res.json(spot);
});

//* Delete a spot
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

//* Get all Reviews by a Spot's id

router.get("/:spotId/reviews", [spotValidation], async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  const Reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["url"],
      },
    ],
  });
  res.json({ Reviews });
});

//* Create a Review for a Spot based on the Spot's id

const checkExistingReview = async (req, res, next) => {
  const review = await Review.findOne({
    where: { userId: req.user.id, spotId: req.params.spotId },
  });
  if (review) {
    const error = new Error("User already has a review for this spot");
    error.status = 403;
    return next(error);
  } else {
    return next();
  }
};

const ReviewValidation = [
  check("review").notEmpty().withMessage("Review text is required"),
  check("stars")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

router.post(
  "/:spotId/reviews",
  [
    restoreUser,
    requireAuth,
    spotValidation,
    checkExistingReview,
    ReviewValidation,
  ],
  async (req, res, next) => {
    const { review, stars } = req.body;
    const user = req.user;
    const newReview = await Review.create({
      userId: user.id,
      spotId: req.params.spotId,
      review,
      stars,
    });
    res.status(201).json(newReview);
  }
);

//* Create a Booking from a Spot based on the Spot's id
const authorizationRequiredBookings = async function (req, res, next) {
  const spot = await Spot.findByPk(req.params.spotId);

  if (req.user.id === spot.ownerId) {
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  }
  next();
};
const checkConflictingBookingExists = async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const user = req.user;
  const bookings = await Booking.findAll({
    where: [{ userId: user.id }, { spotId: req.params.spotId }],
  });

  if (bookings) {
    bookings.forEach((booking) => {
      if (booking.startDate === startDate || booking.endDate === endDate) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.status = 403;
        err.errors = {};
        if (booking.startDate === startDate) {
          err.errors[startDate] =
            "Start date conflicts with an existing booking";
        }
        if (booking.endDate === endDate) {
          err.errors[endDate] = "End date conflicts with an existing booking";
        }
        return next(err);
      }
    });
  }
  return next();
};

router.post(
  "/:spotId/bookings",
  [
    restoreUser,
    spotValidation,
    authorizationRequiredBookings,
    checkConflictingBookingExists,
  ],
  async (req, res, next) => {
    const { startDate, endDate } = req.body;

    const newBooking = await Booking.create({
      spotId: req.params.spotId,
      userId: req.user.id,
      startDate: startDate,
      endDate: endDate,
    });
    res.statusCode = 200;
    res.json(newBooking);
  }
);

//* Get all bookings by spot id
router.get(
  "/:spotId/bookings",
  [restoreUser, requireAuth, spotValidation],
  async (req, res) => {
    const user = req.user;
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot.ownerId === user.id) {
      const bookings = await Booking.findAll({
        where: { spotId: spot.id },
        include: {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      });
      res.json({ Bookings: bookings });
    } else {
      const bookings = await Booking.findAll({
        where: { spotId: spot.id },
        attributes: ["spotId", "startDate", "endDate"],
      });
      res.json({ Bookings: bookings });
    }
  }
);

module.exports = router;
