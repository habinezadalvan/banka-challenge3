module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Savings', [{
    amount: 1000000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Savings', null, {}),
};
