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

// Authentication validation
const authenticationValidation = function (req, res, next) {
  const user = req.user;
  if (!user) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    error.status = 401;
    return next(error);
  }
  return next();
};

const ReviewValidation = [
  check("review").notEmpty().withMessage("Review text is required"),
  check("stars")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];
// does a review exist
const reviewExistValidation = async function (req, res, next) {
  const review = await Review.findByPk(req.params.reviewId);
  if (review) {
    return next();
  } else {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }
};

// Authorization required for Reviews
const authorizationRequiredReviews = async function (req, res, next) {
  const review = await Review.findByPk(req.params.reviewId);
  if (review.userId === req.user.id) {
    return next();
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
};

//* Get all Reviews of the Current User
router.get(
  "/current",
  [restoreUser, authenticationValidation],
  async (req, res, next) => {
    const currentUserReviews = await Review.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Spot,
          attributes: {
            exclude: ["description", "createdAt", "updatedAt"],
          },
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });
    res.json({ Reviews: currentUserReviews });
  }
);

//* Add an Image to a Review based on the Review's id
router.post(
  "/:reviewId/images",
  [restoreUser, requireAuth, authenticationValidation],
  async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      next(err);
    }
    //  max resources validation
    const allReviewImages = await ReviewImage.findAll({
      where: {
        reviewId: {
          [Op.not]: null,
        },
      },
    });
    if (allReviewImages.length > 10) {
      const error = new Error(
        "Maximum number of images for this resource was reached"
      );
      error.status = 403;
      error.statusCode = 403;
      return next(error);
    }
    // create new Image for Review
    const newImage = await ReviewImage.create({
      reviewId: req.params.reviewId,
      url: req.body.url,
    });
    res.json({
      id: newImage.id,
      url: newImage.url,
    });
  }
);

//* Edit a Review

router.put(
  "/:reviewId",
  [
    restoreUser,
    requireAuth,
    reviewExistValidation,
    authenticationValidation,
    authorizationRequiredReviews,
    ReviewValidation,
  ],
  async (req, res, next) => {
    const { review, stars } = req.body;
    const updateReview = await Review.findByPk(req.params.reviewId);

    updateReview.update({
      review: review,
      stars: stars,
    });
    updateReview.updatedAt = new Date();
    res.status(200).json(updateReview);
  }
);

//* Delete a Review
router.delete(
  "/:reviewId",
  [
    restoreUser,
    requireAuth,
    reviewExistValidation,
    authorizationRequiredReviews,
  ],
  async (req, res, next) => {
    await Review.destroy({
      where: {
        id: req.params.reviewId,
      },
    });
    res.status(200).json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  }
);

module.exports = router;
