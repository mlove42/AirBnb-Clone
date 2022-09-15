"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Bookings", [
      {
        spotId: 1,
        userId: 1,
        startDate: "01-01-2021",
        endDate: "01-04, 2021",
      },
      {
        spotId: 1,
        userId: 2,
        startDate: "02-11-2021",
        endDate: "02-14, 2021",
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "06-20-2021",
        endDate: "06-25, 2021",
      },
      {
        spotId: 2,
        userId: 4,
        startDate: "10-12-2021",
        endDate: "10-18, 2021",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Bookings", null, {});
  },
};
