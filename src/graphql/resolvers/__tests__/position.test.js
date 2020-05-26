import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { fetchedUser, testUserTwo } from '../__mocks__/user.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('Position Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input });
  });

  it('should test fetch user position', async () => {
    jest.spyOn(userResolver.User, 'userPosition');
    const res = await userResolver.User.userPosition(fetchedUser, null, userToken);
    expect(res.name).toEqual('member');
  });

  it('should throw an error when the position does not exist', async () => {
    try {
      jest.spyOn(userResolver.User, 'userPosition');
      await userResolver.User.userPosition(testUserTwo, null, userToken);
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('Position not found!');
    }
  });
});
