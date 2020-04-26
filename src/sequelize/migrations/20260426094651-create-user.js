module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
        as: 'roleId',
      },
    },
    positionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Positions',
        key: 'id',
        as: 'positionId',
      },
    },
    userPositionStatusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'UserPositionStatuses',
        key: 'id',
        as: 'userPositionStatusId',
      },
    },
    savingsId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: { tableName: 'Savings' },
        key: 'id',
        as: 'savingsId',
      },
    },
    accountStatus: {
      type: Sequelize.ENUM('active', 'disactivated'),
      defaultValue: 'active',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Users'),
};
