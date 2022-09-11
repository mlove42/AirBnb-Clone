"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
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
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      "Users",
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};
