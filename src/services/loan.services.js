/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
import { ForbiddenError, ApolloError } from 'apollo-server-express';
import models from '../sequelize/models';
import { GeneralClass } from './generalClass.service';
import { getFilename } from '../utils/image.utils';
import {
  findLoan,
  loanParams,
  approveLoan,
  rejectLoan,
  approveLoanPayment,
  closeLoan,
  checkLoan,
} from '../utils/loan.utils';
import { updateInterest } from '../helpers/cron.helper';

export class Loan extends GeneralClass {
  async loanRequest(user) {
    const { amount, paymentDeadLine } = this;

    const { interestRate } = await checkLoan(amount, user);
    const currentInterestRate = interestRate;

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

  async modifyLoan(id, user) {
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

  async updateLoan(input, loggedInUser) {
    const { id, action } = input;

    const actions = {
      approveLoan: 'approving',
      close: 'closing',
      reject: 'rejecting',
      approveLoanPayment: 'ApproveLoanPayment',
    };

    const isValidAction = Object.values(actions).includes(action);

    if (!isValidAction) throw new ForbiddenError('Please provide a valid action!');
    const loan = await findLoan(id);
    if (loan.userId === loggedInUser.id) throw new ForbiddenError('Sorry, you can not update your own loan.');

    let results;

    if (action === actions.approveLoan) {
      results = await approveLoan(input, loan);
    }

    if (action === actions.reject) {
      results = await rejectLoan(input, loan);
    }
    if (action === actions.close) {
      results = await closeLoan(input);
    }
    if (action === actions.approveLoanPayment) {
      results = await approveLoanPayment(input, loan);
    }
    return results;
  }

  async payingLoan(loanId, file, user) {
    const { amount, paymentOption } = this;

    if (
      (paymentOption === undefined || paymentOption === 'bank')
      && file === undefined
    ) throw new ApolloError('Please upload your bank receicpt');

    const filename = await getFilename(file);

    const {
      userId,
      paidAmount,
      paymentOption: defaultPaymentOption,
      bankReceipt,
      approved,
    } = await findLoan(loanId);
    if (userId !== user.id) throw new ForbiddenError('Sorry, you can only pay your own loan!');

    if (!approved) {
      throw new ForbiddenError(
        'You can not pay this loan. It has not been approved yet!',
      );
    }
    let bankReceipts;

    bankReceipt !== null
      ? (bankReceipts = `${bankReceipt}|${filename}`)
      : (bankReceipts = filename);

    const currentPaidAmount = Number(paidAmount) + Number(amount);
    const [, value] = await models.Loan.update(
      {
        paidAmount: currentPaidAmount,
        paymentOption: paymentOption || defaultPaymentOption,
        bankReceipt: bankReceipts,
      },
      {
        where: { id: loanId },
        returning: true,
      },
    );

    return value[0].dataValues;
  }
}
