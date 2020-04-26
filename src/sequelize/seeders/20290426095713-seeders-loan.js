module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Loans', [{
    userId: 1,
    amount: 100000,
    year: 2020,
    requestDate: '2020-01-22 19:10:25-07',
    paymentDeadLine: '2020-04-22 19:10:25-07',
    expectedAmountToBePaid: 120000,
    paidAmount: 110000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Loans', null, {}),
};
