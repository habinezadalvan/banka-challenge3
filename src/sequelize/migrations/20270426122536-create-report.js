
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Reports', {
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
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('meeting', 'financial', 'loan', 'others'),
      defaultValue: 'meeting',
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    // cover: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Reports'),
};
