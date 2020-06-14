import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { loanResolvers } from '../loan.resolvers';
import { loanInput, updateLoanInput, loanInput2 } from '../__mocks__/loan.mocks';
import { req, res } from '../__mocks__/request.response.mocks';
import { postDeadLineCharges } from '../../../utils/loan.utils';


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


describe('Loan Test Suite', () => {
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

  // fetch a single loan

  it('should fetch a loan', async () => {
    jest.spyOn(loanResolvers.Query, 'fetchLoan');
    const results = await loanResolvers.Query.fetchLoan(null, { id: 1 },
      { token: userTwoToken.accessToken });
    expect(results).toHaveProperty('amount');
  });
});

describe('Approve loan suite', () => {
  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated', positionId: 5 } },
      { token: userToken.accessToken },
    );
    userTwoToken = await userResolver.Mutation.userLogin(null, { input: userTwoinput }, { res });
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

  it('should test loan approval', async () => {
    jest.spyOn(loanResolvers.Mutation, 'approveLoan');
    const results = await loanResolvers.Mutation.approveLoan(null, { id: 1 },
      { token: userTwoToken.accessToken });
    expect(results.approved).toBe(true);
  });

  it('should test loan manager requesting for a loan', async () => {
    jest.spyOn(loanResolvers.Mutation, 'addLoan');
    const results = await loanResolvers.Mutation.addLoan(null, { input: loanInput },
      { token: userTwoToken.accessToken });
    expect(results.amount).toEqual('100000');
  });

  it('should throw an error when a loan manager tries to approve loan request that has been approved', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'approveLoan');
      await loanResolvers.Mutation.approveLoan(null, { id: 1 },
        { token: userTwoToken.accessToken });
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('You can not approve this loan, it has been approved already');
    }
  });
  it('should throw an error when a loan manager tries to approve his own loan request', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'approveLoan');
      await loanResolvers.Mutation.approveLoan(null, { id: 4 },
        { token: userTwoToken.accessToken });
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual('Sorry, you can not approve your own loan.');
    }
  });

  it('should throw an error when a person not in charge tries to approve his a loan request', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'approveLoan');
      await loanResolvers.Mutation.approveLoan(null, { id: 4 },
        { token: userToken.accessToken });
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
      expect(err.message).toEqual('Sorry, you are not a loan manager.');
    }
  });
  it('should request another loan with a short payment period', async () => {
    jest.spyOn(loanResolvers.Mutation, 'addLoan');
    const results = await loanResolvers.Mutation.addLoan(null, { input: loanInput2 },
      { token: userToken.accessToken });
    expect(results.amount).toEqual('500000');
  });
  it('should approve loan with short payment period', async () => {
    jest.spyOn(loanResolvers.Mutation, 'approveLoan');
    const results = await loanResolvers.Mutation.approveLoan(null, { id: 5 },
      { token: userTwoToken.accessToken });
    expect(results.approved).toBe(true);
  });
});


describe('Can not approve when account is inactive', () => {
  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated', positionId: 5, positionStatus: 'inactive' } },
      { token: userToken.accessToken },
    );
    userTwoToken = await userResolver.Mutation.userLogin(null, { input: userTwoinput }, { res });
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'disactivated', positionId: 1, positionStatus: 'active' } },
      { token: userToken.accessToken },
    );
    jest.spyOn(userResolver.Mutation, 'logout');
    await userResolver.Mutation.logout(null, null, { req, res });
  });

  it('should throw an error when a loan manager tries to approve loan request while his account is inactive', async () => {
    try {
      jest.spyOn(loanResolvers.Mutation, 'approveLoan');
      await loanResolvers.Mutation.approveLoan(null, { id: 4 },
        { token: userTwoToken.accessToken });
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
      expect(err.message).toEqual('Sorry, your position is no longer active.');
    }
  });
});

describe('Loan unit tests', () => {
  test('post payment deadline', async () => {
    await postDeadLineCharges(5);
  });
});
