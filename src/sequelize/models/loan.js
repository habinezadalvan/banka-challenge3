
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
    approvedAt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentDeadLine: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rejected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    motif: {
      type: DataTypes.TEXT,
      allowNull: true,
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
