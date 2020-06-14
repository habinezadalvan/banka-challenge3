import { ApolloError } from 'apollo-server-express';
import models from '../sequelize/models/index';
import { timeInDays } from '../helpers/time.converter.helpers';

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
