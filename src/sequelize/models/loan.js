
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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false,
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
      allowNull: false,
    },
  }, {});
  Loan.associate = (models) => {
    Loan.belongsTo(models.User, {
      targetKey: 'id',
      as: 'loanOwner',
      onDelete: 'CASCADE',
    });
  };
  return Loan;
};
