import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { fetchedUser, testUserTwo } from '../__mocks__/user.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('Role Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input });
  });

  it('should test fetch user role', async () => {
    jest.spyOn(userResolver.User, 'userRole');
    const res = await userResolver.User.userRole(fetchedUser, null, userToken);
    expect(res.name).toEqual('admin');
  });

  it('should throw an error when the role does not exist', async () => {
    try {
      jest.spyOn(userResolver.User, 'userRole');
      await userResolver.User.userRole(testUserTwo, null, userToken);
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('Role not found!');
    }
  });
});
