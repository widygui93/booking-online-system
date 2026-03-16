const { holdBooking } = require("../databases/database_BOS");

describe("Booking concurrency test", () => {
  const mockUpNames = [
    "Denton",
    "Denver",
    "Denzel",
    "Deon",
    "Derek",
    "Derick",
    "Derin",
    "Dermot",
    "Derren",
    "Derrie",
    "Derrin",
    "Derron",
    "Derry",
    "Derryn",
    "Deryn",
    "Deshawn",
    "Desmond",
    "Dev",
    "Devan",
    "Devin",
  ];
  const mockUpPhoneNumbers = [
    "081234567890",
    "081234567891",
    "081234567892",
    "081234567893",
    "081234567894",
    "081234567895",
    "081234567896",
    "081234567897",
    "081234567898",
    "081234567899",
    "081234567900",
    "081234567901",
    "081234567902",
    "081234567903",
    "081234567904",
    "081234567905",
    "081234567906",
    "081234567907",
    "081234567908",
    "081234567909",
  ];
  const mockUpPayload = {
    booking_created_at: "2025-11-20 10:30:00",
    booking_date: "2025-11-21",
    start_time: "17:15",
    end_time: "18:00",
    timeslots_id: "ce86be08-d9c0-49e0-a4c6-430c24f66eb5",
    massage_id: "f8994022-1626-465f-a2eb-a8c0ac6bee33",
    massage_type: "Thai Style Massage",
    price: 100000,
  };

  it("should prevent overbooking under concurrent requests", async () => {
    const concurrentRequests = 20;

    const requests = Array.from({ length: concurrentRequests }).map(
      async (element, index) => {
        return await holdBooking({
          ...mockUpPayload,
          name: mockUpNames[index],
          phone_number: mockUpPhoneNumbers[index],
        });
      },
    );

    const results = await Promise.allSettled(requests);

    const success = results.filter((result) => {
      return result.value.status === "success";
    });

    const failed = results.filter((result) => {
      return result.value.status === "failed";
    });

    expect(success.length).toBe(10);
    expect(failed.length).toBe(concurrentRequests - 10);
  });
});
