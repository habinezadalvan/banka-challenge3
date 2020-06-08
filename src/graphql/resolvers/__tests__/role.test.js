import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { fetchedUser, testUserTwo } from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;

let userToken;

describe('Role Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  it('should test fetch user role', async () => {
    jest.spyOn(userResolver.User, 'userRole');
    const results = await userResolver.User.userRole(fetchedUser, null, {
      token: userToken.accessToken,
    });
    expect(results.name).toEqual('admin');
  });

  it('should throw an error when the role does not exist', async () => {
    try {
      jest.spyOn(userResolver.User, 'userRole');
      await userResolver.User.userRole(testUserTwo, null, {
        token: userToken.accessToken,
      });
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('Role or Position does not exist!');
    }
  });
});
