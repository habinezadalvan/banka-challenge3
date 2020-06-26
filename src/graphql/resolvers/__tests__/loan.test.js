import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { loanResolvers } from '../loan.resolvers';
import { contributionResolver } from '../contribution.resolver';
import {
  loanInput,
  modifyLoanInput,
  loanInput2,
  fetchedLoan,
} from '../__mocks__/loan.mocks';
import { req, res } from '../__mocks__/request.response.mocks';
import { postDeadLineCharges } from '../../../utils/loan.utils';
import { file } from '../__mocks__/contribution.mocks';

const { USER_PASSWORD } = process.env;

let userToken;
let userTwoToken;

const input = {
  email: 'example@example.com',
  password: USER_PASSWORD,
};

const userTwoinput = {
  email: 'example@example2.com',
  password: USER_PASSWORD,
};

const updateLoanInput = {
  id: 1,
  action: 'approving',
};

describe('Loan Test Suite', () => {
  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated', positionId: 5 } },
      { token: userToken.accessToken },
    );
    userTwoToken = await userResolver.Mutation.userLogin(
      null,
      { input: userTwoinput },
      { res },
    );
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'disactivated', positionId: 1 } },
      { token: userToken.accessToken },
    );
    jest.spyOn(userResolver.Mutation, 'logout');
    await userResolver.Mutation.logout(null, null, { req, res });
  });

  // approve loan

  it('should test loan approval', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: updateLoanInput },
      { token: userTwoToken.accessToken },
    );
    expect(results.approved).toBe(true);
  });

  it('should throw an error when trying to request a loan with unpaid pending loan', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'addLoan');
      await loanResolvers.Mutation.addLoan(
        null,
        {
          input: {
            amount: 100,
            paymentDeadLine: '2020-06-06 19:03:29.722+02',
          },
        },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual(
        'You can not request for a loan, you have an unpaid loan. Please paid the previous loan to request for another.',
      );
    }
  });

  // // pay loan

  it('should test loan payment', async () => {
    jest.spyOn(loanResolvers.Mutation, 'payLoan');
    const results = await loanResolvers.Mutation.payLoan(
      null,
      { id: 1, input: { amount: 10000 }, file },
      { token: userToken.accessToken },
    );
    expect(results.paidAmount).toEqual('120000');
  });


  it('should throw an error when trying to pay more', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'payLoan');
      await loanResolvers.Mutation.payLoan(
        null,
        { id: 1, input: { amount: 10000 }, file },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('You can not over pay, you have already paid your loan. We are processing the approval.');
    }
  });

  // // approve loan payment

  it('should test loan one approval', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: { id: 1, action: 'ApproveLoanPayment' } },
      { token: userTwoToken.accessToken },
    );
    expect(results.paid).toBe(true);
  });

  it('should test loan two approval', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: { id: 2, action: 'ApproveLoanPayment' } },
      { token: userTwoToken.accessToken },
    );
    expect(results.paid).toBe(true);
  });

  // // loan request

  it('should test loan request', async () => {
    jest.spyOn(loanResolvers.Mutation, 'addLoan');
    const results = await loanResolvers.Mutation.addLoan(
      null,
      { input: loanInput },
      { token: userToken.accessToken },
    );
    expect(results.amount).toEqual('100000');
  });

  // // change loan ratings

  it('should test change loan interest rate by admin', async () => {
    jest.spyOn(loanResolvers.Mutation, 'changeRatings');
    const results = await loanResolvers.Mutation.changeRatings(
      null,
      { input: { rate: 7, action: 'rating' } },
      { token: userToken.accessToken },
    );
    expect(results).toEqual('The current interest rate is 7%');
  });

  it('should throw an error when trying to change loan interest rate by admin with invalid action', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'changeRatings');
      await loanResolvers.Mutation.changeRatings(
        null,
        { input: { rate: 7, action: 'invalidaction' } },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Invalid input');
    }
  });

  it('should test change loan allowed percentage by admin', async () => {
    jest.spyOn(loanResolvers.Mutation, 'changeRatings');
    const results = await loanResolvers.Mutation.changeRatings(
      null,
      { input: { rate: 40, action: 'loanPercentage' } },
      { token: userToken.accessToken },
    );
    expect(results).toEqual(
      "The current allowed loan is 40% of member's savings",
    );
  });

  // // update loan

  it('should update amount of loan', async () => {
    jest.spyOn(loanResolvers.Mutation, 'modifyLoan');
    const results = await loanResolvers.Mutation.modifyLoan(
      null,
      { id: 3, input: modifyLoanInput },
      { token: userToken.accessToken },
    );

    expect(results.amount).toEqual('200000');
  });

  it('should update payment deadline of loan ', async () => {
    jest.spyOn(loanResolvers.Mutation, 'modifyLoan');
    const results = await loanResolvers.Mutation.modifyLoan(
      null,
      { id: 3, input: { paymentDeadLine: '2020-09-06 19:03:29.722+02' } },
      { token: userToken.accessToken },
    );
    expect(results.amount).toEqual('200000');
  });

  it('should throw an error when to update a loan which was already approved', async () => {
    jest.spyOn(loanResolvers.Mutation, 'modifyLoan');
    try {
      await loanResolvers.Mutation.modifyLoan(
        null,
        { id: 2, input: { paymentDeadLine: '2020-09-06 19:03:29.722+02' } },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual(
        'Sorry, you can not update this loan request. It has been approved already. If you still need to do the changes, send a closure request.',
      );
    }
  });

  it('should throw an error when the loan does not exist', async () => {
    jest.spyOn(loanResolvers.Mutation, 'modifyLoan');
    try {
      await loanResolvers.Mutation.modifyLoan(
        null,
        { id: 0, input: { paymentDeadLine: '2020-09-06 19:03:29.722+02' } },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Loan not found');
    }
  });

  it('should throw an error when a different user tries to update a loan on a another person', async () => {
    jest.spyOn(loanResolvers.Mutation, 'modifyLoan');
    try {
      await loanResolvers.Mutation.modifyLoan(
        null,
        { id: 1, input: { paymentDeadLine: '2020-09-06 19:03:29.722+02' } },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual(
        'Sorry, you can not update this loan request. You are not the owner.',
      );
    }
  });

  // // fetch a single loan and all loans

  it('should fetch a loan', async () => {
    jest.spyOn(loanResolvers.Query, 'fetchLoan');
    const results = await loanResolvers.Query.fetchLoan(
      null,
      { id: 1 },
      { token: userTwoToken.accessToken },
    );
    expect(results).toHaveProperty('amount');
  });
  it('should fetch a loan owner', async () => {
    jest.spyOn(loanResolvers.Loan, 'user');
    const results = await loanResolvers.Loan.user(fetchedLoan, null, {
      token: userTwoToken.accessToken,
    });
    expect(results.id).toBe(1);
  });

  it('should fetch all loans', async () => {
    jest.spyOn(loanResolvers.Query, 'fetchAllLoans');
    const results = await loanResolvers.Query.fetchAllLoans(
      null,
      { createdAt: '1592380573278' },
      { token: userTwoToken.accessToken },
    );
    expect(results).toEqual([]);
  });
});

describe('Approve, close, reject, approve loan payment suite', () => {
  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated', positionId: 5 } },
      { token: userToken.accessToken },
    );
    userTwoToken = await userResolver.Mutation.userLogin(
      null,
      { input: userTwoinput },
      { res },
    );
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'disactivated', positionId: 1 } },
      { token: userToken.accessToken },
    );
    jest.spyOn(userResolver.Mutation, 'logout');
    await userResolver.Mutation.logout(null, null, { req, res });
  });

  // loan manager paying contribution

  it('should testloan manager paying contribution', async () => {
    jest.spyOn(contributionResolver.Mutation, 'addContribution');
    const results = await contributionResolver.Mutation.addContribution(
      null,
      {
        input: {
          amount: 50000,
          contributionOfMonthOf: '2020-06-06 19:03:29.722+02',
        },
        file,
      },
      { token: userTwoToken.accessToken },
    );
    expect(results.dataValues.amount).toEqual('50000');
  });

  it('should throw an error when trying to pay loan without paymentOption and without providing the receipt', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'payLoan');
      await loanResolvers.Mutation.payLoan(
        null,
        {
          id: 2,
          input: {
            amount: 50000,
          },
        },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Please upload your bank receicpt');
    }
  });

  it('should throw an error when trying to pay loan which is not yours', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'payLoan');
      await loanResolvers.Mutation.payLoan(
        null,
        {
          id: 1,
          input: {
            amount: 50000,
            paymentOption: 'bank',
          },
          file,
        },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Sorry, you can only pay your own loan!');
    }
  });
  // // approving contribution

  it('should test  approve contribution of loan manager', async () => {
    jest.spyOn(contributionResolver.Mutation, 'approveContribution');
    const results = await contributionResolver.Mutation.approveContribution(
      null,
      {
        id: 3,
      },
      { token: userToken.accessToken },
    );
    expect(results.approved).toBe(true);
  });

  it('should test loan manager requesting for a loan', async () => {
    jest.spyOn(loanResolvers.Mutation, 'addLoan');
    const results = await loanResolvers.Mutation.addLoan(
      null,
      {
        input: {
          amount: 10000,
          paymentDeadLine: '2020-09-06 19:03:29.722+02',
        },
      },
      { token: userTwoToken.accessToken },
    );
    expect(results.amount).toEqual('10000');
  });

  it('should throw an error when a loan manager tries to approve loan request that has been approved', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'updateLoan');
      await loanResolvers.Mutation.updateLoan(
        null,
        { input: updateLoanInput },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual(
        'You can not approve this loan, it has been approved already',
      );
    }
  });

  // //
  it('should throw an error when a loan manager tries to approve his own loan request', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'updateLoan');
      await loanResolvers.Mutation.updateLoan(
        null,
        { input: { id: 4, action: 'approving' } },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual('Sorry, you can not update your own loan.');
    }
  });

  it('should throw an error when a person not in charge tries to approve his a loan request', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'updateLoan');
      await loanResolvers.Mutation.updateLoan(
        null,
        { input: { id: 4, action: 'approving' } },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
      expect(err.message).toEqual('Sorry, you are not a loan manager.');
    }
  });

  it('should throw an error when a person in charge tries to update a loan with a wrong action', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'updateLoan');
      await loanResolvers.Mutation.updateLoan(
        null,
        { input: { id: 1, action: 'fake action' } },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual('Please provide a valid action!');
    }
  });

  // // pay and approve loan three so that the user can request another loan with short duration

  it('should throw an error a user tries to pay a loan which is not approved', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'payLoan');
      await loanResolvers.Mutation.payLoan(
        null,
        { id: 3, input: { amount: 212000 }, file },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual(
        'You can not pay this loan. It has not been approved yet!',
      );
    }
  });

  it('should test loan three approval', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      {
        input: {
          id: 3,
          action: 'approving',
        },
      },
      { token: userTwoToken.accessToken },
    );
    expect(results.approved).toBe(true);
  });

  it('should test loan payment', async () => {
    jest.spyOn(loanResolvers.Mutation, 'payLoan');
    const results = await loanResolvers.Mutation.payLoan(
      null,
      { id: 3, input: { amount: 212000 }, file },
      { token: userToken.accessToken },
    );
    expect(results.paidAmount).toEqual('212000');
  });

  it('should test loan payment with mobile money', async () => {
    jest.spyOn(loanResolvers.Mutation, 'payLoan');
    const results = await loanResolvers.Mutation.payLoan(
      null,
      { id: 3, input: { amount: 0, paymentOption: 'mobile' } },
      { token: userToken.accessToken },
    );
    expect(results.id).toBe(3);
  });

  it('should test loan three approval', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: { id: 3, action: 'ApproveLoanPayment' } },
      { token: userTwoToken.accessToken },
    );
    expect(results.paid).toBe(true);
  });
  it('should throw an error when someone tries to request a loan that exceed the allowed amount', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'addLoan');
      await loanResolvers.Mutation.addLoan(
        null,
        { input: loanInput2 },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual(
        'You can not request for this loan. The requested amount of money exceeds 50% of your savings. Your maximum amount should not exceed 280000 frw',
      );
    }
  });

  // //
  it('should request another loan with a short payment period', async () => {
    jest.spyOn(loanResolvers.Mutation, 'addLoan');
    const results = await loanResolvers.Mutation.addLoan(
      null,
      {
        input: {
          amount: 5000,
          paymentDeadLine: `${new Date()}`,
        },
      },
      { token: userToken.accessToken },
    );
    expect(results.amount).toEqual('5000');
  });

  // // rejecting a loan

  it('should test loan rejection', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: { id: 1, action: 'rejecting' } },
      { token: userTwoToken.accessToken },
    );
    expect(results.rejected).toBe(true);
  });

  it('should turn false when a person in charge tries to reject a loan for the second time', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: { id: 1, action: 'rejecting' } },
      { token: userTwoToken.accessToken },
    );
    expect(results.rejected).toBe(false);
  });

  // // closig a loan

  it('should test loan closure', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: { id: 1, action: 'closing' } },
      { token: userTwoToken.accessToken },
    );
    expect(results.closed).toBe(true);
  });

  it('should approve loan with short payment period', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: { id: 5, action: 'approving' } },
      { token: userTwoToken.accessToken },
    );
    expect(results.approved).toBe(true);
  });

  it('should throw an error when trying to approve loan payment with insafficient paid money', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'updateLoan');
      await loanResolvers.Mutation.updateLoan(
        null,
        { input: { id: 5, action: 'ApproveLoanPayment' } },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual(
        'You can not approve this payment. Amount paid is not equal to the expected amount to be paid.',
      );
    }
  });

  it('should test disapproval of loan payment when it was already approved', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(
      null,
      { input: { id: 2, action: 'ApproveLoanPayment' } },
      { token: userTwoToken.accessToken },
    );
    expect(results.paid).toBe(false);
  });

  it('should throw an error when paid amount is no enough', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'updateLoan');
      await loanResolvers.Mutation.updateLoan(
        null,
        { input: { id: 1, action: 'ApproveLoanPayment' } },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual(
        'You can not approve this payment. Amount paid is not equal to the expected amount to be paid.',
      );
    }
  });
});

describe('Can not approve when account is inactive', () => {
  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
    await userResolver.Mutation.updateUser(
      null,
      {
        id: 2,
        input: {
          accountStatus: 'activated',
          positionId: 5,
          positionStatus: 'inactive',
        },
      },
      { token: userToken.accessToken },
    );
    userTwoToken = await userResolver.Mutation.userLogin(
      null,
      { input: userTwoinput },
      { res },
    );
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      {
        id: 2,
        input: {
          accountStatus: 'disactivated',
          positionId: 1,
          positionStatus: 'active',
        },
      },
      { token: userToken.accessToken },
    );
    jest.spyOn(userResolver.Mutation, 'logout');
    await userResolver.Mutation.logout(null, null, { req, res });
  });

  it('should throw an error when a loan manager tries to approve loan request while his account is inactive', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'updateLoan');
      await loanResolvers.Mutation.updateLoan(
        null,
        { input: { id: 4, action: 'approving' } },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
      expect(err.message).toEqual('Sorry, your position is no longer active.');
    }
  });

  // delete a loan
  it('should throw an error when someone tries to delete a loan which does not belong to him/her', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'deleteLoan');
      await loanResolvers.Mutation.deleteLoan(
        null,
        { id: 4 },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Sorry, you can only delete your own loan.');
    }
  });

  it('should throw an error when someone tries to delete a loan which has been approved', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'deleteLoan');
      await loanResolvers.Mutation.deleteLoan(
        null,
        { id: 1 },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('You can not delete an approved loan');
    }
  });
  it('should delete a loan', async () => {
    jest.spyOn(loanResolvers.Mutation, 'deleteLoan');
    const results = await loanResolvers.Mutation.deleteLoan(
      null,
      { id: 4 },
      { token: userTwoToken.accessToken },
    );
    expect(results).toBe(true);
  });
  it('should get loan bank receipt', async () => {
    jest.spyOn(loanResolvers.Loan, 'bankReceipts');
    const loan = {
      id: 1,
      amount: 1000,
      amountToBePaid: 1000,
    };
    const results = await loanResolvers.Loan.bankReceipts(loan, null, {
      token: userTwoToken.accessToken,
    });
    expect(results[0].id).toBe(1);
  });
});

describe('Loan unit tests', () => {
  test('post payment deadline', async () => {
    await postDeadLineCharges(5);
  });
});
