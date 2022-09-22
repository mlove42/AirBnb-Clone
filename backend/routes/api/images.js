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

const checkReviewImageExist = async (req, res, next) => {
  const reviewimage = await ReviewImage.findByPk(req.params.reviewImageId);
  if (reviewimage) {
    return next();
  } else {
    const err = new Error("Image couldn't be found");
    err.status = 404;
    return next(err);
  }
};

// delete a review image authorization
const DeletingReviewImageAuthorization = async (req, res, next) => {
  const image = await ReviewImage.findByPk(req.params.imageId);
  const user = req.user;

  let userId;

  const review = await Review.findByPk(req.params.reviewImageId);
  // console.log(review);
  userId = review.userId;
  // console.log(userId);
  // console.log("test");
  if (user.id === userId) {
    return next();
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
};

// Delete an Review Image
router.delete(
  "/:reviewImageId",
  [
    restoreUser,
    checkReviewImageExist,
    requireAuth,
    DeletingReviewImageAuthorization,
  ],
  async (req, res, next) => {
    const deleteImage = await ReviewImage.findByPk(req.params.reviewImageId);

    if (!deleteImage) {
      const err = new Error("Review Image couldn't be found");
      err.status = 403;
      next(err);
    }

    await ReviewImage.destroy({
      where: {
        id: req.params.reviewImageId,
      },
    });
    res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  }
);

// // delete a spot image
// const checkSpotImageExists = async (req, res, next) => {
//   const spotimage = await SpotImage.findByPk(req.params.spotImageId);
//   if (spotimage) {
//     return next();
//   } else {
//     const err = new Error("Image couldn't be found");
//     err.status = 404;
//     return next(err);
//   }
// };

// delete a spot image authorization
// const DeletingSpotImageAuthorization = async (req, res, next) => {
//   const image = await SpotImage.findByPk(req.params.imageId);
//   const user = req.user;

//   let userId;

//   const spot = await Spot.findByPk(req.params.spotImageId);

//   userId = spot.userId;

//   if (user.id === userId) {
//     return next();
//   } else {
//     const err = new Error("Forbidden");
//     err.status = 403;
//     return next(err);
//   }
// };

// Delete a spot Image
// router.delete(
//   "/:spotImageId",
//   [
//     restoreUser,
//     checkSpotImageExists,
//     requireAuth,
//     DeletingSpotImageAuthorization,
//   ],
//   async (req, res, next) => {
//     const deleteImage = await SpotImage.findByPk(req.params.spotImageId);

//     if (!deleteImage) {
//       const err = new Error("Review Image couldn't be found");
//       err.status = 403;
//       next(err);
//     }

//     await SpotImage.destroy({
//       where: {
//         id: req.params.spotImageId,
//       },
//     });
//     res.json({
//       message: "Successfully deleted",
//       statusCode: 200,
//     });
//   }
// );

module.exports = router;
