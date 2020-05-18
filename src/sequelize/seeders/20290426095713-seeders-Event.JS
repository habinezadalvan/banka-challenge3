module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Events', [{
    userId: 1,
    attendees: ['example@example.com', 'example@example2.com'],
    name: 'meeting',
    description: 'This meeting is for the committee',
    notify: ['example@example.com', 'example@example2.com'],
    startTime: new Date(),
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Events', null, {}),
};
