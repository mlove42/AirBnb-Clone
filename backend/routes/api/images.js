const express = require("express");
const router = express.Router();

const { restoreUser, requireAuth } = require("../../utils/auth");
const { Review, ReviewImage } = require("../../db/models");

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

//* delete a review image authorization
const DeletingReviewImageAuthorization = async (req, res, next) => {
  const image = await ReviewImage.findByPk(req.params.imageId);
  const user = req.user;

  let userId;

  const review = await Review.findByPk(req.params.reviewImageId);

  userId = review.userId;

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

module.exports = router;
