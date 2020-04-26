
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Contributions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      },
    },
    amount: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    month: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    paymentOption: {
      type: Sequelize.ENUM('bank', 'mobile'),
      defaultValue: 'bank',
    },
    paid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    bankReceipt: {
      type: Sequelize.STRING,
      allowNull: true,
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
  down: (queryInterface) => queryInterface.dropTable('Contributions'),
};
