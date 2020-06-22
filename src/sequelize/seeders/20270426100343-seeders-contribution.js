module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Contributions', [
    {
      userId: 1,
      amount: 0,
      contributionOfMonthOf: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 2,
      amount: 100000,
      contributionOfMonthOf: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Contributions', null, {}),
};
