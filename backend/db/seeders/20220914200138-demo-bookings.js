"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Bookings", [
      {
        spotId: 1,
        userId: 2,
        startDate: "2026-01-01",
        endDate: "2026-01-04",
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2021-08-07",
        endDate: "2021-12-31",
      },
      {
        spotId: 3,
        userId: 4,
        startDate: "2026-01-05",
        endDate: "2026-01-10",
      },
      {
        spotId: 4,
        userId: 1,
        startDate: "2026-10-01",
        endDate: "2026-10-12",
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
