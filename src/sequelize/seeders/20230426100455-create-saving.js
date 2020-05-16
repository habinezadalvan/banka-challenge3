module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Savings', [{
    amount: 0,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Savings', null, {}),
};
