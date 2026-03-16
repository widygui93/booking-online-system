'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('customers',[
      {
        id: '6ab056d2-17ab-4426-8227-f84d1988bde8',
        name: 'Widy',
        phone_number: '083175778119',
        is_guest: 1,
        password: ''
      },
      {
        id: 'b2683396-d210-4391-a5b5-f72f73f2872f',
        name: 'Guilias',
        phone_number: '083175778118',
        is_guest: 1,
        password: ''        
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('customers', null, {});
  }
};
