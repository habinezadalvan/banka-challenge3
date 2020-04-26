
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    year: {
      type: DataTypes.NUMBER,
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
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  }, {});
  Loan.associate = (models) => {
    Loan.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'loanOwner',
      onDelete: 'CASCADE',
    });
  };
  return Loan;
};
