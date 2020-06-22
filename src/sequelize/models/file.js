
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    file: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

  }, {});
  File.associate = () => {
  };
  return File;
};
