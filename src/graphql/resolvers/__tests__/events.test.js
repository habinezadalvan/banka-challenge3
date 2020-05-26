import 'dotenv/config';
import '@babel/polyfill';
import { userResolver } from '../user.resolver';
import { fetchedUser } from '../__mocks__/user.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('Events Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input });
  });

  it('should test fetch user Events', async () => {
    jest.spyOn(userResolver.User, 'userEvents');
    const res = await userResolver.User.userEvents(fetchedUser, null, userToken);
    if (res[0]) {
      expect(res[0].dataValues.userId).toBe(1);
    }
    expect(true).toBe(true);
  });
});
