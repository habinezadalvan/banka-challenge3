// import connectDb from '../../../db/connectDb';
import { userResolver } from '../user.resolver';
import {
  user,
  loginData,
  userTwo,
  loginDataTwo,
  updateUserEmail,
} from '../__mocks__/user.mocks';

describe('admin', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    jest.spyOn(userResolver.Mutation, 'userLogin');
    adminToken = await userResolver.Mutation.userLogin(null, {
      input: loginData,
    });
    userToken = await userResolver.Mutation.userLogin(null, {
      input: loginDataTwo,
    });
  });

  it('it should create a user by admin', async () => {
    await jest.spyOn(userResolver.Mutation, 'addUser');
    const createdUser = await userResolver.Mutation.addUser(
      null,
      { input: user },
      adminToken,
    );
    expect(createdUser.email).toEqual('habineza@gmail.com');
  });

  it('it should throw error when a NORMAL user tries to create another user', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'addUser');
      await userResolver.Mutation.addUser(null, { input: user }, userToken);
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
      expect(err.message).toEqual('Sorry, you are not an admin.');
    }
  });

  it('it should throw error when used already exists', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'addUser');
      await userResolver.Mutation.addUser(null, { input: user }, adminToken);
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual('This user already exists.');
    }
  });
  it('it should throw error when creating a user with unvalid email', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'addUser');
      await userResolver.Mutation.addUser(null, { input: userTwo }, adminToken);
    } catch (err) {
      expect(err.constructor.name).toEqual('UserInputError');
      expect(err.message).toEqual('email must be a valid email');
    }
  });
  it('it should throw error when admin tries to create a user without login', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'addUser');
      await userResolver.Mutation.addUser(
        null,
        { input: userTwo },
        { token: null },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('Please login to proceed!!');
    }
  });
  it('admin updates the user', async () => {
    await jest.spyOn(userResolver.Mutation, 'updateUser');
    const updatedUser = await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: updateUserEmail },
      adminToken,
    );
    expect(updatedUser.email).toEqual(
      updateUserEmail.email && updateUserEmail.email.toLocaleLowerCase(),
    );
  });
  it('should throw an error when trying to update a user who does not exists', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'updateUser');
      await userResolver.Mutation.updateUser(
        null,
        { id: 0, input: updateUserEmail },
        adminToken,
      );
    } catch (err) {
      expect(err.message).toEqual('Sorry, That user does  not exists!');
    }
  });
  it('should throw an error when trying to update an email or username to the ones with already exists', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'updateUser');
      await userResolver.Mutation.updateUser(
        null,
        { id: 2, input: { email: user.email } },
        adminToken,
      );
    } catch (err) {
      expect(err.message).toEqual('Sorry, you can not update this user. Email or username already exists');
    }
  });
});
