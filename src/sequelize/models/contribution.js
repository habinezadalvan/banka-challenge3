
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
    bankReceipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {});
  Contribution.associate = () => {
  };
  return Contribution;
};
