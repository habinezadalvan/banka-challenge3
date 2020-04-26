module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Votes', [{
    candidateId: 1,
    positionId: 1,
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Votes', null, {}),
};
