"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Reviews", [
      {
        userId: 1,
        spotId: 2,
        review: "This was an awesome spot!",
        stars: 5,
      },
      {
        userId: 2,
        spotId: 1,
        review: "This place is haunted! Come with friends and not family lol !",
        stars: 3,
      },
      {
        userId: 3,
        spotId: 2,
        review: "Best place I every stayed but the neighbor are rude!",
        stars: 4,
      },
      {
        userId: 1,
        spotId: 2,
        review: "I loved it here!",
        stars: 5,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterfact.bulkDelete("Reviews", null, {});
  },
};
