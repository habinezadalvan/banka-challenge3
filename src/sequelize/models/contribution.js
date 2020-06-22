
module.exports = (sequelize, DataTypes) => {
  const Contribution = sequelize.define('Contribution', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    contributionOfMonthOf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentOption: {
      type: DataTypes.ENUM({
        values: ['bank', 'mobile'],
      }),
      defaultValue: 'bank',
    },
  }, {});
  Contribution.associate = (models) => {
    Contribution.hasOne(models.File, {
      foreignKey: 'contributionId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Contribution;
};
