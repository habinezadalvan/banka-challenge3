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
  return Asset;
};
