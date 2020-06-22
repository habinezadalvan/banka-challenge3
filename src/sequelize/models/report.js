module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM({
        values: ['meeting', 'financial', 'laon', 'others'],
      }),
      defaultValue: 'meeting',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  }, {});
  Report.associate = (models) => {
    Report.hasMany(models.File, {
      foreignKey: 'reportId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Report;
};
