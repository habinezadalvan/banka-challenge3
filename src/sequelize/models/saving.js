
module.exports = (sequelize, DataTypes) => {
  const Saving = sequelize.define('Saving', {
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {});
  Saving.associate = (models) => {
    Saving.belongsTo(models.User, {
      foreignKey: 'savingsId',
      as: 'owner',
    });
  };
  return Saving;
};
