'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('rooms',[
      {
        id: '04485092-c0b1-4c9a-9431-48ad96bd6de9',
        room_number: 1,
        is_active: 1
      },
      {
        id: '16149c83-9112-4d64-b8ec-b4ca9f6ed536',
        room_number: 2,
        is_active: 1     
      },
      {
        id: '3154503c-0d17-465f-9455-e12e1b6675a8',
        room_number: 3,
        is_active: 1
      },
      {
        id: 'cfd8abde-a409-42b4-bb77-6471530db201',
        room_number: 4,
        is_active: 1     
      },
      {
        id: '676046be-ae57-4116-9e13-2ae69997b815',
        room_number: 5,
        is_active: 1
      },
      {
        id: '656cf292-08e2-4299-a69d-327625374429',
        room_number: 6,
        is_active: 1     
      },     
      {
        id: 'e3e42a42-61ce-41a9-8044-1c4cc46f4624',
        room_number: 7,
        is_active: 1
      },
      {
        id: '2b1a2fd4-d4f8-49c5-a522-5d9b185e3974',
        room_number: 8,
        is_active: 1     
      },
      {
        id: '1733808f-449c-4f61-9bbc-38b8ee6d89c3',
        room_number: 9,
        is_active: 1
      },
      {
        id: 'c619d13f-c304-4feb-9e38-6a68533ef97f',
        room_number: 10,
        is_active: 1     
      },                   
    ]);
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('rooms', null, {});
  }
};
