const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const { restoreUser, requireAuth } = require("../../utils/auth");
const {
  Booking,

  Spot,
} = require("../../db/models");

//* Get all of the Current User's Bookings

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

//* Delete a booking
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
