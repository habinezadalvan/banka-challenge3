
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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentOption: {
      type: DataTypes.ENUM({
        values: ['bank', 'mobile'],
      }),
      defaultValue: 'bank',
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bankReceipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {});
  Contribution.associate = (models) => {
    Contribution.belongsTo(models.User, {
      targetKey: 'id',
      onDelete: 'CASCADE',
    });
  };
  return Contribution;
};
