import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { loginDataThree, user } from '../__mocks__/user.mocks';

const { USER_PASSWORD } = process.env;

describe('User Test Suite', () => {
  let input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  it('Login a user', async () => {
    jest.spyOn(userResolver.Mutation, 'userLogin');
    const res = await userResolver.Mutation.userLogin(null, { input });
    expect(res).toHaveProperty('token');
  });
  it('Should throw an errow when there is incorrect password or email', async () => {
    input = {
      email: 'example@example.com',
      password: 'USER_PASSWORD',
    };
    try {
      jest.spyOn(userResolver.Mutation, 'userLogin');
      await userResolver.Mutation.userLogin(null, { input });
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
    }
  });
  it('Should throw an errow when the account is not verified', async () => {
    try {
      jest.spyOn(userResolver.Mutation, 'userLogin');
      await userResolver.Mutation.userLogin(null, { input: loginDataThree });
    } catch (err) {
      expect(err.message).toEqual('Please verify your account before you login!');
    }
  });
  it('should test forgot password', async () => {
    jest.spyOn(userResolver.Mutation, 'forgotPassword');
    const res = await userResolver.Mutation.forgotPassword(null, { email: input.email });
    expect(res).toEqual('Comfirm your email to complete the process. We sent you a reset password email. N.B: The process will be cancelled in one day.');
  });
  it('should throw an error when trying to reset a password of non-existing email', async () => {
    try {
      jest.spyOn(userResolver.Mutation, 'forgotPassword');
      await userResolver.Mutation.forgotPassword(null, { email: user.email });
    } catch (err) {
      expect(err.message).toEqual('Sorry, user not found!');
    }
  });
});
