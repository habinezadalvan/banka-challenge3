module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Votes', [{
    userId: 1,
    position_Id: 1,
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Votes', null, {}),
};
