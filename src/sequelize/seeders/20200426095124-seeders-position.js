module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Positions', [{
    name: 'member',
    description: 'this is a normal member',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Positions', null, {}),
};
