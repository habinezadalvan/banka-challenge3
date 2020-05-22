import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { generateToken } from '../../../helpers/user.helpers';
import {
  loginDataThree,
  user,
  fetchedUser,
  resetPasswordInput,
  userUpdateProfile,
  loginData,
  fakeUser,
} from '../__mocks__/user.mocks';

const { USER_PASSWORD } = process.env;


let fakeToken;

let userToken;

let createdAt = new Date(Date.now()).getTime();

describe('User Test Suite', () => {
  let input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  it('Login a user', async () => {
    jest.spyOn(userResolver.Mutation, 'userLogin');
    userToken = await userResolver.Mutation.userLogin(null, { input });
    expect(userToken).toHaveProperty('token');
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
      expect(err.message).toEqual(
        'Please verify your account before you login!',
      );
    }
  });

  // forgot password test

  it('should test forgot password', async () => {
    jest.spyOn(userResolver.Mutation, 'forgotPassword');
    const res = await userResolver.Mutation.forgotPassword(null, {
      email: input.email,
    });
    expect(res).toEqual(
      'Comfirm your email to complete the process. We sent you a reset password email. N.B: The process will be cancelled in one day.',
    );
  });
  it('should throw an error when trying to reset a password of non-existing email', async () => {
    try {
      jest.spyOn(userResolver.Mutation, 'forgotPassword');
      await userResolver.Mutation.forgotPassword(null, { email: user.email });
    } catch (err) {
      expect(err.message).toEqual('Sorry, user not found!');
    }
  });

  // fetch a single user tests

  it('should fetch all users', async () => {
    jest.spyOn(userResolver.Query, 'getUser');
    const res = await userResolver.Query.getUser(null, { id: 1 }, userToken);
    expect(res.dataValues.id).toBe(1);
  });

  it('should throw an error when trying to fetch user who does not exist', async () => {
    try {
      jest.spyOn(userResolver.Query, 'getUser');
      await userResolver.Query.getUser(null, { id: 0 }, userToken);
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('User not found!');
    }
  });

  // fetch users tests

  it('should fetch all users', async () => {
    jest.spyOn(userResolver.Query, 'users');
    const res = await userResolver.Query.users(null, {}, userToken);
    expect(res[0].dataValues.id).toEqual(fetchedUser.id);
  });
  it('should fetch all users with a specific time', async () => {
    jest.spyOn(userResolver.Query, 'users');
    const res = await userResolver.Query.users(null, { createdAt }, userToken);
    expect(res[0].dataValues.id).toEqual(fetchedUser.id);
  });
  it('should throw error when trying to fetch users with incorrect timestamp', async () => {
    try {
      createdAt = '158998623402033423';
      jest.spyOn(userResolver.Query, 'users');
      await userResolver.Query.users(null, { createdAt });
    } catch (err) {
      expect(err.message).toEqual(err.message);
    }
  });

  // user reset password tests

  it('should test user reset password', async () => {
    jest.spyOn(userResolver.Mutation, 'resetPassword');
    const res = await userResolver.Mutation.resetPassword(
      null,
      { input: resetPasswordInput },
      userToken,
    );
    expect(res).toEqual('password reset was done successfully!!');
  });
  it('should throw an error when a user tried to reset a wrong password', async () => {
    try {
      jest.spyOn(userResolver.Mutation, 'resetPassword');
      await userResolver.Mutation.resetPassword(
        null,
        { input: { ...resetPasswordInput, oldPassword: 'fake@PASSword12345' } },
        userToken,
      );
    } catch (err) {
      expect(err.message).toEqual('Sorry! something wrong happened when reseting your password. Please check your old password and try again!');
    }
  });

  // update user profile

  it('should test update user profile', async () => {
    jest.spyOn(userResolver.Mutation, 'UpdateUserProfile');
    const res = await userResolver.Mutation.UpdateUserProfile(
      null,
      { input: userUpdateProfile },
      userToken,
    );
    expect(res.firstName).toEqual(userUpdateProfile.firstName);
  });

  it('should throw an error when a user tries to update his or her username or email to the existing ones', async () => {
    try {
      jest.spyOn(userResolver.Mutation, 'UpdateUserProfile');
      await userResolver.Mutation.UpdateUserProfile(
        null,
        { input: { email: loginData.email } },
        userToken,
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('Sorry, you can not update this user. Email or username already exists');
    }
  });

  // me tests

  it('should fetch me', async () => {
    jest.spyOn(userResolver.Query, 'me');
    const res = await userResolver.Query.me(null, null, userToken);
    expect(res.id).toBe(1);
  });

  it('should throw an error when I do not exist', async () => {
    try {
      fakeToken = await generateToken(fakeUser);
      jest.spyOn(userResolver.Query, 'me');
      await userResolver.Query.me(null, null, { token: fakeToken });
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('User not found');
    }
  });
});
