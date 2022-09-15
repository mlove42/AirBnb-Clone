// backend/routes/api/session.js
const express = require("express");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];
const router = express.Router();
// Log in
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  // const user = await User.scope("loginUser").login({ credential, password });
  const user = await User.scope("loginUser").login({ credential, password });
  // const user = await User.findAll();
  if (!user) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Validation error";
    err.errors = ["The provided credentials were invalid."];
    return next(err);
  }

  //add a token name key to the user.dataValues object, then set the token value as the value to the key value pair
  user.dataValues["token"] = setTokenCookie(res, user);
  // user.dataValues["token2"] = req.cookies.token;
  //we have to remove the createdAT and updatedAt values

  res.json(user);
});

// Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

// Restore session user
router.get("/", restoreUser, (req, res) => {
  const { user } = req;
  if (user) {
    return res.json({
      user: user.toSafeObject(),
    });
  } else return res.json({});
});

module.exports = router;
