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
