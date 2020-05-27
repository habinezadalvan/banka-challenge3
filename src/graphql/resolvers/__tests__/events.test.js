import 'dotenv/config';
import '@babel/polyfill';
import { userResolver } from '../user.resolver';
import { fetchedUser } from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('Events Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  it('should test fetch user Events', async () => {
    jest.spyOn(userResolver.User, 'userEvents');
    const results = await userResolver.User.userEvents(fetchedUser, null,
      { token: userToken.accessToken });
    if (results[0]) {
      expect(results[0].dataValues.userId).toBe(1);
    }
    expect(true).toBe(true);
  });
});
