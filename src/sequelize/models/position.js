
module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define('Position', {
    name: {
      type: DataTypes.STRING,
      defaultValue: 'member',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {});
  Position.associate = (models) => {
    Position.belongsTo(models.User, {
      foreignKey: 'positionId',
      onDelete: 'CASCADE',
    });
  };
  return Position;
};
