/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
import { ForbiddenError, ApolloError } from 'apollo-server-express';
import models from '../sequelize/models';
import { GeneralClass } from './generalClass.service';
import {
  findLoan,
  loanParams,
  calculateNewDeadLine,
} from '../utils/loan.utils';
import { updateInterest } from '../helpers/cron.helper';


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

  async getLoan(id) {
    updateInterest(id);
    const loan = await findLoan(id);
    return loan;
  }

  async updateLoan(id, user) {
    const { amount, paymentDeadLine, motif } = this;
    const loan = await findLoan(id);

    if (loan.userId !== user.id) {
      throw new ForbiddenError(
        'Sorry, you can not update this loan request. You are not the owner.',
      );
    }
    if (loan.approved === true) {
      throw new ForbiddenError(
        'Sorry, you can not update this loan request. It has been approved already. If you still need to do the changes, send a closure request.',
      );
    }


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
    const [, value] = await models.Loan.update(
      {
        amount,
        interest,
        expectedAmountToBePaid: amountToPay,
        motif,
      },
      { where: { id }, returning: true },
    );

    return value[0].dataValues;
  }

  async approvingLoan(id, loggedInUser) {
    const loan = await findLoan(id);
    if (loan.userId === loggedInUser.id) throw new ForbiddenError('Sorry, you can not approve your own loan.');
    if (loan.approved === true) {
      throw new ApolloError(
        'You can not approve this loan, it has been approved already',
      );
    }

    const {
      createdAt, paymentDeadLine,
    } = loan;
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

    return value[0].dataValues;
  }
}
