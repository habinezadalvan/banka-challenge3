module.exports = (sequelize, DataTypes) => {
  const Saving = sequelize.define('Saving', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {});
  Saving.associate = (models) => {
    Saving.hasOne(models.User, {
      foreignKey: 'savingId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Saving;
};
