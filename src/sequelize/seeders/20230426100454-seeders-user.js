require('dotenv').config();
const { hashSync } = require('bcryptjs');

const { USER_PASSWORD } = process.env;

const hashPasswordSeeds = (password) => hashSync(password, 10);

const userPassword = hashPasswordSeeds(USER_PASSWORD);

module.exports = {
  hashPasswordSeeds,
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@example.com',
      userName: 'johndoe',
      password: userPassword,
      phoneNo: '+230494484475',
      avatar: 'image',
      roleId: 1,
      positionId: 1,
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'John2',
      lastName: 'Doe2',
      email: 'example@example2.com',
      userName: 'johndoe2',
      password: userPassword,
      phoneNo: '+230494484475',
      avatar: 'image',
      roleId: 2,
      positionId: 1,
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'John3',
      lastName: 'Doe3',
      email: 'example@example3.com',
      userName: 'johndoe3',
      password: userPassword,
      phoneNo: '+230494484475',
      avatar: 'image',
      roleId: 2,
      positionId: 1,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
