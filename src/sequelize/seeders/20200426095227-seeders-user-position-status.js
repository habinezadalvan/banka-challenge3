module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('UserPositionStatuses', [{
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('UserPositionStatuses', null, {}),
};
