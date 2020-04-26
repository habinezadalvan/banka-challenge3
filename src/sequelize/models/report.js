
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM({
        values: ['meeting', 'financial', 'laon'],
      }),
      defaultValue: 'meeting',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});
  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'reporter',
      onDelete: 'CASCADE',
    });
  };
  return Report;
};
