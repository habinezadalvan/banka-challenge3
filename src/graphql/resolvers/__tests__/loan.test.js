import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { loanResolvers } from '../loan.resolvers';
import { loanInput } from '../__mocks__/loan.mocks';
import { res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('Loan Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

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
});
