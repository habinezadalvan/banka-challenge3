
module.exports = (sequelize, DataTypes) => {
  const Saving = sequelize.define('Saving', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {});
  Saving.associate = (models) => {
    Saving.belongsTo(models.User, {
      targetKey: 'id',
      onDelete: 'CASCADE',
    });
  };
  return Saving;
};
