"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Spots", [
      {
        ownerId: 1,
        address: "312 N Spring St",
        city: "Los Angeles",
        state: "Cali",
        country: "USA",
        lat: 34.055038,
        lng: -118.242447,
        name: "The Dream",
        description: "Your dream place 1",
        price: 124,
        previewImage:
          "https://cdn2.lamag.com/wp-content/uploads/sites/6/2018/06/GettyImages-500797911.jpg",
      },
      {
        ownerId: 2,
        address: "123 Air Drive",
        city: "Sandusky",
        state: "Ohio",
        country: "USA",
        lat: 23.254933,
        lng: -218.222543,
        name: "Home",
        description: "Your dream place 2",
        price: 674,
        previewImage:
          "https://luxury-houses.net/wp-content/uploads/2020/08/Exquisite-Los-Angeles-Modern-House-215-N-Saltair-Ave-1.jpg",
      },
      {
        ownerId: 3,
        address: "455 App Road",
        city: "Camp",
        state: "Summer",
        country: "USA",
        lat: 56.254933,
        lng: -314.208443,
        name: "Party",
        description: "Your dream place 3",
        price: 100,
        previewImage:
          "https://media.architecturaldigest.com/photos/5ce2effc711f0003f83fc38d/master/w_1600,c_limit/012%20Ottolenghi.jpg",
      },
      {
        ownerId: 4,
        address: "824 Lakers Drive",
        city: "Kobe",
        state: "Cali",
        country: "USA",
        lat: 98.254933,
        lng: -824.208443,
        name: "KB",
        description: "Your dream place 4",
        price: 824,
        previewImage:
          "https://managecasa.com/wp-content/uploads/2021/02/shutterstock_1731900589-e1612637876218-995x460.jpg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Spots", null, {});
  },
};
