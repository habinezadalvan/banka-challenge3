import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { testUser, testUserTwo } from '../__mocks__/user.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('savings Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input });
  });

  it('should test fetch user savings', async () => {
    jest.spyOn(userResolver.User, 'userSavings');
    const res = await userResolver.User.userSavings(testUser, null, userToken);
    expect(res.amount).toEqual('0');
  });
  it('should return null when there is no savings', async () => {
    jest.spyOn(userResolver.User, 'userSavings');
    const res = await userResolver.User.userSavings(testUserTwo, null, userToken);
    expect(res).toEqual([]);
  });
});
