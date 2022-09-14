"use strict";
const bcrypt = require("bcryptjs");

const users = [
  {
    firstName: "Harry",
    lastName: "Potter",
    username: "testOne",
    email: "demo@user.io",
    hashedPassword: bcrypt.hashSync("password"),
  },
  {
    firstName: "Allen",
    lastName: "James",
    username: "userTwo",
    email: "user1@user.io",
    hashedPassword: bcrypt.hashSync("password2"),
  },
  {
    firstName: "Keith",
    lastName: "Vanhorn",
    username: "bigThree",
    email: "user2@user.io",
    hashedPassword: bcrypt.hashSync("password3"),
  },
  {
    firstName: "Good",
    lastName: "Luck",
    username: "luckyCharm",
    email: "luckyAirbnb@gamil.com",
    hashedPassword: bcrypt.hashSync("password4"),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", users);
  },
};
