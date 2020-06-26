module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Files', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    reportId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Reports',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    loanId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Loans',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    contributionId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Contributions',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Events',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    assetId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Assets',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    file: {
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
  down: (queryInterface) => queryInterface.dropTable('Files'),
};
