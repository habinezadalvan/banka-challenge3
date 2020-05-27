import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { fetchedUser, testUserTwo } from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('Position Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  it('should test fetch user position', async () => {
    jest.spyOn(userResolver.User, 'userPosition');
    const results = await userResolver.User.userPosition(fetchedUser, null,
      { token: userToken.accessToken });
    expect(results.name).toEqual('member');
  });

  it('should throw an error when the position does not exist', async () => {
    try {
      jest.spyOn(userResolver.User, 'userPosition');
      await userResolver.User.userPosition(testUserTwo, null, { token: userToken.accessToken });
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('Position not found!');
    }
  });
});
