module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    count: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  }, {});
  Vote.associate = (models) => {
    Vote.belongsTo(models.User, {
      foreignKey: 'candidateId',
      as: 'candidate',
    });
    Vote.hasOne(models.Position, {
      foreignKey: 'positionId',
      as: 'position',
    });
  };
  return Vote;
};
