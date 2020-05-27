import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { fetchedUser } from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;

let userToken;

describe('Reports Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  it('should test fetch user Reports', async () => {
    jest.spyOn(userResolver.User, 'userReports');
    const results = await userResolver.User.userReports(fetchedUser, null, {
      token: userToken.accessToken,
    });
    expect(results[0].dataValues.userId).toBe(1);
  });
});
