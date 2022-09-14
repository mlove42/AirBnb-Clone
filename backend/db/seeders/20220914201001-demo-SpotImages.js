"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("SpotImages", [
      {
        spotId: 1,
        url: "https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg",
      },
      {
        spotId: 2,
        url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      },
      {
        spotId: 3,
        url: "https://photographylife.com/wp-content/uploads/2017/01/Best-of-2016-Nasim-Mansurov-20.jpg",
      },
      {
        spotId: 4,
        url: "https://ichef.bbci.co.uk/news/999/cpsprodpb/6D5A/production/_119449972_10.jpg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterfact.bulkDelete("SpotImages", null, {});
  },
};
