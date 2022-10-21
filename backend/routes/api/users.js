// backend/routes/api/users.js
const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");

const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSignup2 = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required"),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("lastName is required"),
  handleValidationErrors,
];

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post("/", [validateSignup], async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;
  const signUpUser = await User.findOne({ where: { email: email } });
  if (signUpUser) {
    const err = new Error("User already exists");
    err.status = 403;
    err.errors = {
      email: "User with that email already exists",
    };
    next(err);
  }

  const signUpUserName = await User.findOne({ where: { username: username } });
  if (signUpUserName) {
    const err = new Error("User already exists");
    err.status = 403;
    err.errors = {
      username: "User with that username already exists",
    };
    next(err);
  }
  const user = await User.signup({
    firstName,
    lastName,
    username,
    email,
    password,
  });

  user.dataValues["token"] = setTokenCookie(res, user);

  res.json(user);
});
module.exports = router;
