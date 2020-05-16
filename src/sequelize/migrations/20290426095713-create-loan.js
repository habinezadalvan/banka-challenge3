module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Loans', {
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
    year: {
      type: Sequelize.INTEGER,
    },
    requestDate: {
      type: Sequelize.DATE,
    },
    paymentDeadLine: {
      type: Sequelize.DATE,
    },
    paid: {
      type: Sequelize.BOOLEAN,
    },
    expectedAmountToBePaid: {
      type: Sequelize.BIGINT,
    },
    paidAmount: {
      type: Sequelize.BIGINT,
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
  down: (queryInterface) => queryInterface.dropTable('Loans'),
};
