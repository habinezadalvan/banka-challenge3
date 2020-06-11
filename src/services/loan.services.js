/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';
import { GeneralClass } from './generalClass.service';


export class Loan extends GeneralClass {
  async loanRequest(user) {
    const { amount, paymentDeadLine } = this;

    const findLoanInterestRate = await models.Loan.findOne({ where: { id: 1 } });

    let myInterestRate = 0;

    myInterestRate = findLoanInterestRate.interestRate;

    const interest = Number(amount) * (Number(myInterestRate) / 100);


    const amountToPay = Number(amount) + Math.round(interest);


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
}
