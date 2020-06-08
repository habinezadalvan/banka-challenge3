import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { contributionResolver } from '../contribution.resolver';
import { fetchedUser } from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';
import { file, contributionInput } from '../__mocks__/contribution.mocks';

const { USER_PASSWORD } = process.env;

let userToken;

describe('Contribution Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  it('should test pay contribution and upload bankReceipt', async () => {
    jest.spyOn(contributionResolver.Mutation, 'addContribution');
    const results = await contributionResolver.Mutation.addContribution(
      null,
      {
        input: contributionInput,
        file,
      },
      { token: userToken.accessToken },
    );
    expect(results.dataValues).toHaveProperty('approved');
  });

  it('should test pay contribution without bank receipt', async () => {
    jest.spyOn(contributionResolver.Mutation, 'addContribution');
    const results = await contributionResolver.Mutation.addContribution(
      null,
      {
        input: contributionInput,
      },
      { token: userToken.accessToken },
    );
    expect(results.dataValues).toHaveProperty('approved');
  });

  it('should test fetch user Contribution', async () => {
    jest.spyOn(userResolver.User, 'userContributions');
    const results = await userResolver.User.userContributions(
      fetchedUser,
      null,
      { token: userToken.accessToken },
    );
    expect(results[0].dataValues.userId).toBe(1);
  });
});
