module.exports = (sequelize, DataTypes) => {
  const UserPositionStatus = sequelize.define('UserPositionStatus', {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  }, {});
  UserPositionStatus.associate = (models) => {
    UserPositionStatus.belongsTo(models.User, {
      foreignKey: 'UserPositionStatusId',
      onDelete: 'CASCADE',
    });
  };
  return UserPositionStatus;
};
