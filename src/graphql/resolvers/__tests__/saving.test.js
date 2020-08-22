import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { res } from '../__mocks__/request.response.mocks';

const { USER_PASSWORD } = process.env;


describe('savings Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  it('should return null when there is no savings', async () => {

  });
});
