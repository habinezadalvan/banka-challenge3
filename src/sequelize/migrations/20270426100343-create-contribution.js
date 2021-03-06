
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
        onDelete: 'CASCADE',
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
    contributionOfMonthOf: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    paymentOption: {
      type: Sequelize.ENUM('bank', 'mobile'),
      defaultValue: 'bank',
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
