module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@example.com',
      userName: "johndoe",
      password: "thisisit",
      bio: "this is the bio",
      avatar: 'image',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};