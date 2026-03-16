"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert("timeslots", [
      {
        id: "61b138c2-3f91-452c-98d2-22d438013e57",
        date: "2025-11-21",
        start_time: "08:00",
        end_time: "08:45",
        timeslot_code: "TSC-9273",
      },
      {
        id: "78f4bd59-21e5-4bcd-b5dc-37d200c0ad09",
        date: "2025-11-21",
        start_time: "08:55",
        end_time: "09:40",
        timeslot_code: "TSC-2265",
      },
      {
        id: "efbfbddc-9372-4246-a7f9-a179b84e2775",
        date: "2025-11-21",
        start_time: "09:50",
        end_time: "10:35",
        timeslot_code: "TSC-8864",
      },
      {
        id: "d38108e0-0a34-4ee4-b7ef-506db728a0f9",
        date: "2025-11-21",
        start_time: "10:45",
        end_time: "11:30",
        timeslot_code: "TSC-7573",
      },
      {
        id: "2c9023d9-a46a-4f7e-9594-f3c98445bbf5",
        date: "2025-11-21",
        start_time: "11:40",
        end_time: "12:25",
        timeslot_code: "TSC-9809",
      },
      {
        id: "ee343795-415a-4b56-8a79-df0b0d8f1d5c",
        date: "2025-11-21",
        start_time: "13:35",
        end_time: "14:20",
        timeslot_code: "TSC-8755",
      },
      {
        id: "3b2c960d-2a0a-4659-806f-aea2a5681be5",
        date: "2025-11-21",
        start_time: "14:30",
        end_time: "15:15",
        timeslot_code: "TSC-9985",
      },
      {
        id: "278ee13b-8d13-46bf-b781-673d5841288f",
        date: "2025-11-21",
        start_time: "15:25",
        end_time: "16:10",
        timeslot_code: "TSC-6641",
      },
      {
        id: "06a5a300-e86e-4def-b90b-6e80ecc6315b",
        date: "2025-11-21",
        start_time: "16:20",
        end_time: "17:05",
        timeslot_code: "TSC-7650",
      },
      {
        id: "ce86be08-d9c0-49e0-a4c6-430c24f66eb5",
        date: "2025-11-21",
        start_time: "17:15",
        end_time: "18:00",
        timeslot_code: "TSC-8009",
      },
      {
        id: "80c1dee2-cfbf-4435-9bf7-2c054e0a84a4",
        date: "2025-11-21",
        start_time: "19:10",
        end_time: "19:55",
        timeslot_code: "TSC-7650",
      },
      {
        id: "53add963-255d-4c8c-98f9-3ea8be69f6e1",
        date: "2025-11-21",
        start_time: "20:05",
        end_time: "20:50",
        timeslot_code: "TSC-8921",
      },
      {
        id: "9c0b8db8-2f40-4111-b1a2-3b0e748e43e3",
        date: "2025-11-21",
        start_time: "21:00",
        end_time: "21:45",
        timeslot_code: "TSC-8112",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("timeslots", null, {});
  },
};
