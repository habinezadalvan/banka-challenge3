module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', [
    {
      name: 'admin',
      description: 'this is admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'normal-user',
      description: 'this is normal user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {}),
};
