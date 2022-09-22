// backend/routes/api/index.js
const router = require("express").Router();

const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const reviewsRouter = require("./reviews");
const imagesRouter = require("./images");
const bookingsRouter = require("./bookings");
const { requireAuth } = require("../../utils/auth.js");
const { restoreUser } = require("../../utils/auth.js");

const spotsRouter = require("./spot");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);
router.use("/session", sessionRouter);

router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);
router.use("/images", imagesRouter);
router.use("/bookings", bookingsRouter);
router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
