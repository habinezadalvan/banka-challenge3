import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { fetchedUser } from '../__mocks__/user.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('Reports Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input });
  });

  it('should test fetch user Reports', async () => {
    jest.spyOn(userResolver.User, 'userReports');
    const res = await userResolver.User.userReports(fetchedUser, null, userToken);
    expect(res[0].dataValues.userId).toBe(1);
  });
});
