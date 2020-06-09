module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Contributions', [
    {
      userId: 1,
      amount: 33000,
      contributionOfMonthOf: new Date(),
      bankReceipt: 'thisisreceipt',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 2,
      amount: 35000,
      contributionOfMonthOf: new Date(),
      bankReceipt: 'thisisreceipt',
      createdAt: new Date(),
      updatedAt: new Date(),
    },

  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Contributions', null, {}),
};
