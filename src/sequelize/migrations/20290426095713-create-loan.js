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
    paymentDeadLine: {
      type: Sequelize.DATE,
    },
    paid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    expectedAmountToBePaid: {
      type: Sequelize.BIGINT,
    },
    paidAmount: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    interestRate: {
      type: Sequelize.INTEGER,
      defaultValue: 2,
    },
    interest: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    },
    rejected: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    closed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    motif: {
      type: Sequelize.TEXT,
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
  down: (queryInterface) => queryInterface.dropTable('Loans'),
};
