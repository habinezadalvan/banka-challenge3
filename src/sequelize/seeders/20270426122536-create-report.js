module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Reports', [{
    userId: 1,
    title: 'all members meeting',
    content: 'this is meeting was well attended',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Reports', null, {}),
};
