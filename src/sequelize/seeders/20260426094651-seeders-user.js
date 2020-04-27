module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [{
    firstName: 'John',
    lastName: 'Doe',
    email: 'example@example.com',
    userName: 'johndoe',
    password: '$2a$10$DY/BslOVgLFnDmSC1706m.5uXVqvTb2N3sUdYOtHS4bEHBqE0X/5K',
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
