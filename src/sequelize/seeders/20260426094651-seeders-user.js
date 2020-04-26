module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [{
    firstName: 'John',
    lastName: 'Doe',
    email: 'example@example.com',
    userName: 'johndoe',
    password: 'thisisit',
    phoneNo: '+230494484475',
    avatar: 'image',
    roleId: 1,
    positionId: 1,
    userPositionStatusId: 1,
    savingsId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
