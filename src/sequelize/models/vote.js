module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  Vote.associate = () => {
    // association here
  };
  return Vote;
};
