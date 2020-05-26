import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { fetchedUser } from '../__mocks__/user.mocks';

const { USER_PASSWORD } = process.env;

let userToken;


describe('Votes Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input });
  });

  it('should test fetch user Votes', async () => {
    jest.spyOn(userResolver.User, 'userVotes');
    const res = await userResolver.User.userVotes(fetchedUser, null, userToken);
    expect(res[0].dataValues.candidateId).toBe(1);
  });
});
