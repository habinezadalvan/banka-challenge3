import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { loanResolvers } from '../loan.resolvers';
import { loanInput, updateLoanInput } from '../__mocks__/loan.mocks';
import { req, res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;

let userToken;
let userTwoToken;

describe('Loan Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  const userTwoinput = {
    email: 'example@example2.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated' } },
      { token: userToken.accessToken },
    );
    userTwoToken = await userResolver.Mutation.userLogin(null, { input: userTwoinput }, { res });
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'disactivated' } },
      { token: userToken.accessToken },
    );
    jest.spyOn(userResolver.Mutation, 'logout');
    await userResolver.Mutation.logout(null, null, { req, res });
  });

  // loan request

  it('should test loan request', async () => {
    jest.spyOn(loanResolvers.Mutation, 'addLoan');
    const results = await loanResolvers.Mutation.addLoan(null, { input: loanInput },
      { token: userToken.accessToken });
    expect(results.amount).toEqual('100000');
  });

  it('should test change loan interest rate by admin', async () => {
    jest.spyOn(loanResolvers.Mutation, 'changeInterestRate');
    const results = await loanResolvers.Mutation.changeInterestRate(null, { rate: 7 },
      { token: userToken.accessToken });
    expect(results).toEqual('The current interest rate is 7%');
  });

  // update loan

  it('should update amount of loan ', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(null, { id: 1, input: updateLoanInput },
      { token: userToken.accessToken });
    expect(results.amount).toEqual('200000');
  });

  it('should update payment deadline of loan ', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    const results = await loanResolvers.Mutation.updateLoan(null, { id: 1, input: { paymentDeadLine: '2020-09-06 19:03:29.722+02' } },
      { token: userToken.accessToken });
    expect(results.amount).toEqual('200000');
  });

  it('should throw an error when to update a loan which was already approved', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    try {
      await loanResolvers.Mutation.updateLoan(null, { id: 2, input: { paymentDeadLine: '2020-09-06 19:03:29.722+02' } },
        { token: userToken.accessToken });
    } catch (err) {
      expect(err.message).toEqual('Sorry, you can not update this loan request. It has been approved already. If you still need to do the changes, send a closure request.');
    }
  });

  it('should throw an error when the loan does not exist', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    try {
      await loanResolvers.Mutation.updateLoan(null, { id: 0, input: { paymentDeadLine: '2020-09-06 19:03:29.722+02' } },
        { token: userToken.accessToken });
    } catch (err) {
      expect(err.message).toEqual('Loan not found');
    }
  });

  it('should throw an error when a different user tries to update a loan on a another person', async () => {
    jest.spyOn(loanResolvers.Mutation, 'updateLoan');
    try {
      await loanResolvers.Mutation.updateLoan(null, { id: 1, input: { paymentDeadLine: '2020-09-06 19:03:29.722+02' } },
        { token: userTwoToken.accessToken });
    } catch (err) {
      expect(err.message).toEqual('Sorry, you can not update this loan request. You are not the owner.');
    }
  });
});
