import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { fetchedUser } from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;

let userToken;

describe('VotingEvents Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  it('should test fetch user VotingEvents', async () => {
    jest.spyOn(userResolver.User, 'userVotingEvents');
    const results = await userResolver.User.userVotingEvents(
      fetchedUser,
      null,
      { token: userToken.accessToken },
    );
    expect(results[0].dataValues.userId).toBe(1);
  });
});
