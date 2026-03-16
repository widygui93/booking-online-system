'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('therapists',[
      {
        id: 'b8d6d65a-8f05-4a55-85a4-1e5f870b4a52',
        name: 'Budi',
        is_active: 1,
        profile_picture: ''
      },
      {
        id: 'b289d2a1-5c35-4037-8fe3-70022f93abc6',
        name: 'Bambang',
        is_active: 1,
        profile_picture: ''            
      },
      {
        id: '826f4f34-bb97-4b61-96d1-8c7557b6f409',
        name: 'Ayu',
        is_active: 1,
        profile_picture: ''
      },
      {
        id: '52545b97-d1d7-4f3c-b31a-239119050f8b',
        name: 'Sandy',
        is_active: 1,
        profile_picture: ''   
      },
      {
        id: 'a7a3423f-08b2-4408-8fcc-ce53e8fd0113',
        name: 'Agung',
        is_active: 1,
        profile_picture: ''
      },
      {
        id: '441a98c5-bf1e-43f6-876d-b67166d6765f',
        name: 'Bunga',
        is_active: 1,
        profile_picture: ''   
      },     
      {
        id: '6f675de5-52b7-4fd7-9886-2024788fbab6',
        name: 'Dedi',
        is_active: 1,
        profile_picture: ''
      },
      {
        id: '07e95c0d-697e-46e0-b2a7-9102dc3193bc',
        name: 'Dinda',
        is_active: 1,
        profile_picture: ''   
      },
      {
        id: '8db18f7a-2477-406a-ac4e-6d816ef791ad',
        name: 'Santi',
        is_active: 1,
        profile_picture: ''
      },
      {
        id: 'ef40abce-632b-4e29-8d1f-71cb55e622c1',
        name: 'Joko',
        is_active: 1,
        profile_picture: ''    
      },                   
    ]);
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('therapists', null, {});
  }
};
