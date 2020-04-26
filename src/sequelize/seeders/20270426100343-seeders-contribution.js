module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Contributions', [{
    userId: 1,
    amount: 33000,
    paid: true,
    year: 2020,
    month: 'january',
    bankReceipt: 'thisisreceipt',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Contributions', null, {}),
};
