/* eslint-disable class-methods-use-this */
import { ForbiddenError } from 'apollo-server-express';
import models from '../sequelize/models';
import { GeneralClass } from './generalClass.service';
import { findLoan, loanParams } from '../utils/loan.utils';

export class Loan extends GeneralClass {
  async loanRequest(user) {
    const { amount, paymentDeadLine } = this;

    const findLoanInterestRate = await findLoan(1);
    const currentInterestRate = findLoanInterestRate.interestRate;

    const parameters = {
      amount,
      paymentDeadLine,
      issuedTime: Date.now(),
      interestRate: currentInterestRate,
    };

    const { interest, amountToPay, myInterestRate } = loanParams(parameters);

    // create count down

    // if count down is at zero I will start to count the time
    // then duration will be duration in months + counted months after the countdown
    // then update the expected amount to pay and interest..

    // loan count down should start after the loan was approved

    // check the loan createdAT and loan approved time and make the difference
    // then update expected paying date by adding the difference to expected paying date.

    const laonData = {
      amount,
      paymentDeadLine,
      userId: user.id,
      expectedAmountToBePaid: amountToPay,
      interest: Math.round(interest),
      interestRate: myInterestRate,
    };

    const loan = await models.Loan.create(laonData);
    return loan.dataValues;
  }

  async updateLoan(id, user) {
    const { amount, paymentDeadLine, motif } = this;
    const loan = await findLoan(id);

    if (loan.userId !== user.id) {
      throw new ForbiddenError(
        'Sorry, you can not update this loan request. You are not the owner.',
      );
    }
    if (loan.approved === true) throw new ForbiddenError('Sorry, you can not update this loan request. It has been approved already. If you still need to do the changes, send a closure request.');

    const loanIssuedInterestRate = loan.interestRate;

    let parameters = {
      amount,
      paymentDeadLine,
      issuedTime: loan.createdAt,
      interestRate: loanIssuedInterestRate,
    };

    if ((amount && !paymentDeadLine) || (paymentDeadLine && !amount)) {
      parameters = {
        ...parameters,
        amount: amount || loan.amount,
        paymentDeadLine: paymentDeadLine || loan.paymentDeadLine,
      };
    }

    const { interest, amountToPay } = loanParams(parameters);
    const [, value] = await models.Loan.update({
      amount, interest, expectedAmountToBePaid: amountToPay, motif,
    }, { where: { id }, returning: true });

    return value[0].dataValues;
  }
}
