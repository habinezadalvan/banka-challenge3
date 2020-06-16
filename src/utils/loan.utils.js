import { ApolloError, ForbiddenError } from 'apollo-server-express';
import { Op } from 'sequelize';
import models from '../sequelize/models/index';
import { timeInDays } from '../helpers/time.converter.helpers';
import { findSaving } from './saving.utils';
import { findUser } from './user.utils';

export const findLoan = async (id) => {
  const loan = await models.Loan.findOne({ where: { id } });
  if (!loan) throw new ApolloError('Loan not found');
  return loan.dataValues;
};

export const loanParams = (values) => {
  let myInterestRate = 0;

  myInterestRate = values && values.interestRate;
  const time = timeInDays(values && values.paymentDeadLine, values && values.issuedTime)
    / 30;
  const durationInMonths = Math.round(time);
  const interest = ((Number(values && values.amount) * Number(myInterestRate)) / 100)
    * durationInMonths;
  const amountToPay = Number(values && values.amount) + Math.round(interest);
  return {
    interest,
    amountToPay,
    myInterestRate,
  };
};

export const calculateNewDeadLine = (
  expectedDeadlineBeforeApproval,
  loanRequestedDate,
) => {
  const daysDifference = timeInDays(
    expectedDeadlineBeforeApproval,
    loanRequestedDate,
  );

  const roundedTimeDiffence = Math.round(daysDifference) * Math.sign(daysDifference);

  const dayInMillseconds = 1000 * 60 * 60 * 24;
  const roundedTimeDiffenceInMillseconds = roundedTimeDiffence * dayInMillseconds;
  const date = new Date();
  const currentTime = date.getTime();

  const futureTime = currentTime + roundedTimeDiffenceInMillseconds;
  date.setTime(futureTime);
  return date;
};

export const updateUserSavings = async (loanUserId, requestedAmount) => {
  const { savingId } = await findUser({ id: loanUserId });
  const { amount } = await findSaving(savingId);

  const currentAmount = Number(amount) - Number(requestedAmount);

  await models.Saving.update(
    { amount: currentAmount },
    { where: { id: savingId }, returning: true },
  );
};

export const postDeadLineCharges = async (id) => {
  const loan = await findLoan(id);

  const {
    amount,
    interestRate,
    paymentDeadLine,
    interest,
    expectedAmountToBePaid,
    paid,
    approved,
  } = loan;

  const monthlyInterest = Math.round(
    (Number(amount) * Number(interestRate)) / 100,
  );

  const newAmountToPay = Number(expectedAmountToBePaid) + Number(monthlyInterest);

  const newInterest = Number(interest) + Number(monthlyInterest);

  const date = new Date(paymentDeadLine);

  const now = new Date(Date.now());

  if (approved === true && date < now && paid === false) {
    await models.Loan.update(
      {
        interest: newInterest,
        expectedAmountToBePaid: newAmountToPay,
      },
      { where: { id }, returning: true },
    );
  }
};

export const approveLoan = async (input, loan) => {
  const { id } = input;

  if (loan.approved === true) {
    throw new ApolloError(
      'You can not approve this loan, it has been approved already',
    );
  }

  const { createdAt, paymentDeadLine, userId } = loan;
  const loanRequestedDate = createdAt;
  const expectedDeadlineBeforeApproval = paymentDeadLine;

  const updatedDeadLine = calculateNewDeadLine(
    expectedDeadlineBeforeApproval,
    loanRequestedDate,
  );

  const [, value] = await models.Loan.update(
    {
      paymentDeadLine: updatedDeadLine,
      approvedAt: Date.now(),
      approved: true,
    },
    { where: { id }, returning: true },
  );
  const { amount } = value[0].dataValues;
  updateUserSavings(userId, amount);
  return value[0].dataValues;
};

export const rejectLoan = async (input, loan) => {
  const { id } = input;
  const { rejected } = loan;

  let results;
  if (rejected) {
    const [, value] = await models.Loan.update(
      {
        rejected: false,
      },
      { where: { id }, returning: true },
    );
    results = value[0].dataValues;
  } else {
    const [, value] = await models.Loan.update(
      {
        rejected: true,
      },
      { where: { id }, returning: true },
    );
    results = value[0].dataValues;
  }
  return results;
};

export const closeLoan = async (input) => {
  const { id } = input;

  const [, value] = await models.Loan.update(
    {
      closed: true,
    },
    { where: { id }, returning: true },
  );
  return value[0].dataValues;
};

export const approveLoanPayment = async (input, loan) => {
  const { id } = input;
  const { paid, paidAmount, expectedAmountToBePaid } = loan;

  if (paidAmount < expectedAmountToBePaid) {
    throw new ForbiddenError(
      'You can not approve this payment. Amount paid is not equal to the expected amount to be paid.',
    );
  }
  let results;

  if (paid) {
    const [, value] = await models.Loan.update(
      {
        paid: false,
      },
      { where: { id }, returning: true },
    );
    results = value[0].dataValues;
  } else {
    const [, value] = await models.Loan.update(
      {
        paid: true,
      },
      { where: { id }, returning: true },
    );
    results = value[0].dataValues;
  }
  return results;
};

export const checkLoan = async (requestedAmount, user) => {
  const unpaidLoan = await models.Loan.findAll({
    where: { [Op.and]: { userId: user.id, paid: false } },
  });
  const refetchUser = await findUser({ id: user.id });

  const { savingId } = refetchUser;

  if (unpaidLoan.length > 0) {
    throw new ForbiddenError(
      'You can not request for a loan, you have an unpaid loan. Please paid the previous loan to request for another.',
    );
  }
  const savings = await findSaving(savingId);
  if (!savings) {
    throw new ForbiddenError(
      'Sorry, you are not allowed to request for a loan. You have no savings yet!',
    );
  }

  const { allowPercentage, interestRate } = await findLoan(1);

  let myAllowedPercentage = 0;

  myAllowedPercentage = allowPercentage;

  const allowedLoanAmount = Math.round(
    (Number(savings.amount) * myAllowedPercentage) / 100,
  );

  if (requestedAmount > allowedLoanAmount) {
    throw new ForbiddenError(
      `You can not request for this loan. The requested amount of money exceeds 50% of your savings. Your maximum amount should not exceed ${allowedLoanAmount} frw`,
    );
  }

  return { interestRate };
};
