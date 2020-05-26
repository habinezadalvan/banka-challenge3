module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Savings', [{
    amount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Savings', null, {}),
};
