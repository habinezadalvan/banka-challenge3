
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
    Position.hasMany(models.User, {
      foreignKey: 'positionId',
      onDelete: 'CASCADE',
    });
    Position.hasMany(models.Vote, {
      foreignKey: 'position_Id',
      onDelete: 'CASCADE',
    });
  };
  return Position;
};
