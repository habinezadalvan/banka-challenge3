module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('VoteEvents', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 1,
      references: {
        model: 'Users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    votingMembers: {
      allowNull: true,
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    positionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'Positions',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    candidates: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    },
    startTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    closeTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'closed',
    },
    notify: {
      allowNull: true,
      type: Sequelize.ARRAY(Sequelize.STRING),
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

  down: (queryInterface) => queryInterface.dropTable('VoteEvents'),
};
