const { conflicted } = require("../databases/conflictingBooking");
const { Op } = require("sequelize");

/**
 * Creates a mock Booking model for unit tests.
 * findOne resolves to the given result (e.g. conflict row or null).
 * Optionally assert the query options passed to findOne.
 */
function createMockBooking(findOneResult) {
  return {
    findOne: jest.fn().mockResolvedValue(findOneResult),
  };
}

/**
 * Fake transaction object that conflicted() uses only for lock and transaction.
 */
function createMockTransaction() {
  return {
    LOCK: { UPDATE: "UPDATE" },
  };
}

describe("conflictingBooking.conflicted (unit tests with mocks)", () => {
  const timeslot_code = "TSC-8009";
  const selectedRoomID = "2b1a2fd4-d4f8-49c5-a522-5d9b185e3974";
  const selectedTherapistID = "ef40abce-632b-4e29-8d1f-71cb55e622c1";
  const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const mockTransaction = createMockTransaction();

  it("should not allow booking when conflicting booking is found", async () => {
    const mockConflict = { id: "c83ff8f5-677c-4985-b127-3f9da5c48065" };
    const mockBooking = createMockBooking(mockConflict);

    const result = await conflicted(
      mockBooking,
      timeslot_code,
      selectedRoomID,
      selectedTherapistID,
      mockTransaction,
      pastDate,
    );

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("id", "c83ff8f5-677c-4985-b127-3f9da5c48065");
    expect(mockBooking.findOne).toHaveBeenCalledTimes(1);
    const callOptions = mockBooking.findOne.mock.calls[0][0];
    expect(callOptions.where).toMatchObject({
      timeslot_code,
      status: { [Op.in]: ["confirmed", "pending_verification", "pending_payment"] },
      expires_at: { [Op.gte]: pastDate },
    });
    expect(callOptions.where[Op.or]).toEqual(
      expect.arrayContaining([
        { room_id: selectedRoomID },
        { therapist_id: selectedTherapistID },
      ]),
    );
  });

  it("should allow booking when conflicting booking is not found", async () => {
    const mockBooking = createMockBooking(null);

    const result = await conflicted(
      mockBooking,
      timeslot_code,
      "3154503c-0d17-465f-9455-e12e1b6675a8",
      selectedTherapistID,
      mockTransaction,
      pastDate,
    );

    expect(result).toBeNull();
    expect(mockBooking.findOne).toHaveBeenCalledTimes(1);
  });
});
