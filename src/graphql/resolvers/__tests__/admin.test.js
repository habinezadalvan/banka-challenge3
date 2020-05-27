// import connectDb from '../../../db/connectDb';
import { userResolver } from '../user.resolver';
import {
  user,
  loginData,
  userTwo,
  loginDataTwo,
  updateUserRole,
} from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';

describe('admin', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    jest.spyOn(userResolver.Mutation, 'userLogin');
    adminToken = await userResolver.Mutation.userLogin(
      null,
      {
        input: loginData,
      },
      { res },
    );
    userToken = await userResolver.Mutation.userLogin(
      null,
      {
        input: loginDataTwo,
      },
      { res },
    );
  });

  it('it should create a user by admin', async () => {
    await jest.spyOn(userResolver.Mutation, 'addUser');
    const createdUser = await userResolver.Mutation.addUser(
      null,
      { input: user },
      { token: adminToken.accessToken },
    );
    expect(createdUser.email).toEqual('email@gmail.com');
  });

  // update a user by admin

  it('admin updates the user', async () => {
    await jest.spyOn(userResolver.Mutation, 'updateUser');
    const updatedUser = await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated' } },
      { token: adminToken.accessToken },
    );
    expect(updatedUser.accountStatus).toEqual('activated');
  });

  it('should throw an when an admin tries to update a user with non-existing role or position', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'updateUser');
      await userResolver.Mutation.updateUser(
        null,
        {
          id: 2,
          input: {
            accountStatus: 'activated',
            roleId: 10000,
            positionId: 20000,
          },
        },
        { token: adminToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual(
        'Sorry, you can not update this user. There is a problem in the role or position you are providing',
      );
    }
  });
  it('should throw an when an admin tries to update a user with non-existing position and existing role', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'updateUser');
      await userResolver.Mutation.updateUser(
        null,
        {
          id: 2,
          input: { accountStatus: 'activated', roleId: 1, positionId: 20000 },
        },
        { token: adminToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual(
        'Sorry, you can not update this user. There is a problem in the role or position you are providing',
      );
    }
  });

  it('should throw an when an admin tries to update a user with non-existing role', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'updateUser');
      await userResolver.Mutation.updateUser(
        null,
        {
          id: 2,
          input: { accountStatus: 'activated', roleId: 1000 },
        },
        { token: adminToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual(
        'Sorry, you can not update this user. There is a problem in the role or position you are providing',
      );
    }
  });

  it('should throw an when an admin tries to update a user with non-existing position', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'updateUser');
      await userResolver.Mutation.updateUser(
        null,
        {
          id: 2,
          input: { accountStatus: 'activated', positionId: 20000 },
        },
        { token: adminToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual(
        'Sorry, you can not update this user. There is a problem in the role or position you are providing',
      );
    }
  });

  it('it should throw error when an account is disactivated', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'addUser');
      await userResolver.Mutation.addUser(
        null,
        { input: user },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual('Your account was disactivated');
    }
  });

  it('it should throw error when a NORMAL user tries to create another user', async () => {
    userToken = await userResolver.Mutation.userLogin(
      null,
      {
        input: loginDataTwo,
      },
      { res },
    );
    try {
      await jest.spyOn(userResolver.Mutation, 'addUser');
      await userResolver.Mutation.addUser(
        null,
        { input: user },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
      expect(err.message).toEqual('Sorry, you are not an admin.');
    }
  });

  it('it should throw error when used already exists', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'addUser');
      await userResolver.Mutation.addUser(
        null,
        { input: user },
        { token: adminToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual('This user already exists.');
    }
  });
  it('it should throw error when creating a user with unvalid email', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'addUser');
      await userResolver.Mutation.addUser(
        null,
        { input: userTwo },
        { token: adminToken.accessToken },
      );
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

  it('should throw an error when trying to update a user who does not exists', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'updateUser');
      await userResolver.Mutation.updateUser(
        null,
        { id: 0, input: updateUserRole },
        { token: adminToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Sorry, That user does  not exists!');
    }
  });
  it('should delete a user by admin', async () => {
    await jest.spyOn(userResolver.Mutation, 'deleteUser');
    const results = await userResolver.Mutation.deleteUser(
      null,
      { id: 4 },
      { token: adminToken.accessToken },
    );
    expect(results).toEqual('User deleted successfully!');
  });
  it('should throw error when trying to delete nonexisting user', async () => {
    try {
      await jest.spyOn(userResolver.Mutation, 'deleteUser');
      await userResolver.Mutation.deleteUser(
        null,
        { id: 4 },
        { token: adminToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Sorry, That user does  not exists!');
    }
  });
});
