const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
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

// Helper function for validation error
const validationError = (message, code) => {
  let error = new Error("Validation error");
  error.status = code;
  error.errors = {
    endDate: message,
    statusCode: code,
  };
  return error;
};

// helper function for a particular element not found
const notFound = (el, code) => {
  let error = new Error(`${el} couldn't be found`);
  error.status = code;
  error.statusCode = code;
  return error;
};

// helper function for a review that already exists, may not need since this only occurs once?
const bookingExists = (bookingError) => {
  let error = new Error(
    "Sorry, this spot is already booked for the specified dates"
  );
  error.status = 403;
  error.statusCode = 403;
  error.errors = {};
  if (bookingError.startDate) {
    error.errors.startDate = bookingError.startDate;
  }
  if (bookingError.endDate) {
    error.errors.endDate = bookingError.endDate;
  }
  return error;
};

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Start date is required"),
  check("endDate")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("End date is required"),
  handleValidationErrors,
];

// Get all of the Current User's Bookings

router.get("/current", [restoreUser], async (req, res) => {
  const Bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  res.json({ Bookings });
});

//* Edit a Booking

router.put("/:bookingId", [restoreUser], async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const updateBooking = await Booking.findByPk(req.params.bookingId);
  if (!updateBooking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    next(err);
  }

  // Update booking
  updateBooking.update({
    startDate: startDate,
    endDate: endDate,
    updatedAt: new Date(),
  });
  // send the response for successful update
  res.status = 200;
  res.json(updateBooking);
});

//! Delete a booking
const checkBookingExists = async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  if (booking) {
    return next();
  } else {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    return next(err);
  }
};
router.delete(
  "/:bookingId",
  [restoreUser, requireAuth, checkBookingExists],
  async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    await booking.destroy();
    res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  }
);

module.exports = router;
