### work in progress

- need edit table timeslots and services to add column timeslots_code and massage_code(done)
- after creating booking, need to send OTP to WhatsApp for verification(done)
- need to do transaction first before save hash OTP into DB(done)
- implement rate limiter when booking, enforce one active pending booking (pending_verification or pending_payment) per one phone number(done)
- testing the rate limiter when booking(done)
- need to ALTER table booking, add field booking_created_at (date time when the booking created) and change booking_date type data to date only(done)
- need to adjust validation for field booking_date for bookingValidator.js because data type change from datetime to date only(done)
- when the phone number already in table customers then do not insert new record with same phone number when booking(done)
- [refactoring] in database_BOS there is redundant query to table bookings when to find takenTherapists and takenRooms, the query filter is same so it can refactor to only query once and then use it to find takenTherapists and takenRooms(done)
- for otp verification(done)
  - need to check booking id exist in table otp, if not throw error "failed verification"(done)
  - need to check value of attempts in otp table based on the booking_id to validate total max attempts of otp(done)
  - need to check the expired of the otp(done)
  - need to check if the otp has already been verified(done)
  - because of resend otp feature so there will be more than 1 record otp in table otps, check by ordering the latest one(done)
  - probably need one field in table otps which is is_replaced(done)
  - need to check the valid otp after it has been hashed with the latest hash otp from DB, when the user input false otp then increment value of 1 in attempts column(done)
  - when verify otp success, need to update table bookings for column status to pending_payment(done)
  - need to debug,when verify otp correctly get error undefined for result variable(done)
- for resend otp(done)
  - check for the existing booking_id before process the resend otp(done)
  - before resend need to check the time of the latest otp based on the booking id, the time may not less than 1 minute because it is allowed to resend after 1 minute to the latest otp(done)
  - max attempts for reset otp is 5 attempts for 1 booking,so need to validate the max attempts for resend, when total resend attempts is >=5 the user need to book the new one so redirect the user to home page(done)
  - when user hit resend otp it will mark the latest otp to true for is_replaced then insert a new record, [ERROR] Error: Unknown column 'start_time' in 'field list'(done)
- create scheduler for cleaning expired pending_verification for bookings table in status column, need to join table bookings and otps(done)
  - join with otps table, filter with status = pending_verification in table bookings and expired_at <= NOW() in otps table, it is ONE-to-MANY associations(done)
  - get the bookings id(done)
  - update the status in booking table from pending_verification to expired_verification, need to tested it first(done)
- create unit testing for booking concurrency test(done)
- create unit testing for booking conflict test(done)
- for payment
  - testing positive flow(done)
  - need to test negative flow
  - need to check the body/payload of endpoint /payment with table booking,payment and customer to make sure the data is correct and not modified(done)
  - need to verify if it is already success for verify otp so the payment can not be bypass(done)
  - need to check is the payment already expired(done)
  - need to check is the resources (timeslot and room ) or (timeslot and therapist) already status confirmed booking before do payment,so each customers will not fight over same resources, example select customer_code , room_id, therapist_id, timeslot_code from bookings where customer_code = 'a' for update; if (customer's timeslot_code and customer's threparist_id) or (customer's timeslot_code and customer's room_id) get status confirmed, it means there is customer already confirmed the booking resouces, so must return failed, message: already confirmed booking
  - when do payments need to lock and transactional (done)
  - check status transaction before payment(done)
  - also and try to implement idempotency keys which to recognize and safely retry requests without causing duplicate actions, so after payment finish successfully the locking will be released and the other request of payment will be failed to avoid duplicate booking(done)

## KNOWN ERROR

- when create payment error cause when insert customer id , it still not availble in table customer cause havent commit yet(solved)

### booking process

- create data customer first to return its id from DB
- create data payment with status pending in table payments and return its id
- find timeslot_code based on timeslots_id coming from front end request
- find massage_code based on massage_id coming from front end request
- status booking: pending_verification -> first step of process booking, need to verify
- status booking: pending_payment -> verify process successfully and waiting for payment
- status booking: confirmed -> booking is finish successfully
- status booking: failure -> booking is failed and release the resource
- status booking: expired_verification -> booking is expired after waiting for verification, either trigger by user's action or system
- status booking: expired_payment -> booking is expired after waiting for payment, either trigger by user's action or system

### OTHERS

- it is recommended to store date time in DB in UTC+00 and convert them to the desired time zone (UTC+7, in your case) within the client application
- it is not necessary to have expired_at column for table booking cause the expired of payment is the expired of booking, so they share the same values of expired_at

### THINGS TO CONSIDERS FOR THE FUTURE

- when scheduler running for cleaning expired verification,it will scan all records in the table, so if the table growing huge, it may cause to update performance in table bookings

### TECH STACKS

- NodeJs
- ExpressJS
- MySQL
- Sequelize ORM
- JWT
- Better-Auth (authentication and authorization)
- Jest (unit testting)
- Winston (Logging)
- Midtrans (payment gateway)

### REFERENCES

- For unit testing
  - https://github.com/stuyy/expressjs-full-course
  - https://github.com/stuyy/expressjs-full-course/blob/master/src/__tests__/users.spec.js
  - https://www.albertgao.com/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
  - https://jestjs.io/docs/getting-started
