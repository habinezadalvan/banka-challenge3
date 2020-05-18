module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('VoteEvents', [{
    userId: 1,
    positionId: 1,
    status: 'open',
    votingMembers: ['example@example.com', 'example@example2.com'],
    candidates: ['example@example.com'],
    notify: ['example@example.com', 'example@example2.com'],
    startTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('VoteEvents', null, {}),
};
