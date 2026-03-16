"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert("services", [
      {
        id: "f8994022-1626-465f-a2eb-a8c0ac6bee33",
        massage_type: "Thai Style Massage",
        price: 100000,
        massage_code: "MSG_THA",
      },
      {
        id: "f34f3c59-758d-4a19-afee-8d3359b194cf",
        massage_type: "Japanese Style Massage",
        price: 120000,
        massage_code: "MSG_JPN",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("services", null, {});
  },
};
