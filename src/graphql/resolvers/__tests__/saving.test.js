import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { testUser, testUserThree } from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;

let userToken;

describe('savings Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  // it('should test fetch user savings', async () => {
  //   jest.spyOn(userResolver.User, 'userSavings');
  //   const results = await userResolver.User.userSavings(testUser, null, {
  //     token: userToken.accessToken,
  //   });
  //   expect(results.amount).toEqual('1000000');
  // });
  it('should return null when there is no savings', async () => {
    jest.spyOn(userResolver.User, 'userSavings');
    const results = await userResolver.User.userSavings(testUserThree, null, {
      token: userToken.accessToken,
    });
    expect(results).toBe(null);
  });
});
