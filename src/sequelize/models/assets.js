module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {});
  Asset.associate = (models) => {
    Asset.hasMany(models.File, {
      foreignKey: 'assetId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Asset;
};
