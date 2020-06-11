
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paymentDeadLine: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expectedAmountToBePaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    interestRate: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
    interest: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {});
  Loan.associate = () => {
  };
  return Loan;
};
