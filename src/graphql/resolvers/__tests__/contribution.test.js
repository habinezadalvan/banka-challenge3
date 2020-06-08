import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { contributionResolver } from '../contribution.resolver';
import { fetchedUser } from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';
import { file, contributionInput } from '../__mocks__/contribution.mocks';

const { USER_PASSWORD } = process.env;

let userToken;

let secretaryToken;

let userTwoToken;

describe('Contribution Test Suite', () => {
  const input = {
    email: 'example@example.com',
    password: USER_PASSWORD,
  };

  const userTwoInput = {
    email: 'example@example2.com',
    password: USER_PASSWORD,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input }, { res });
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated' } },
      { token: userToken.accessToken },
    );
    userTwoToken = await userResolver.Mutation.userLogin(null, { input: userTwoInput }, { res });
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'disactivated' } },
      { token: userToken.accessToken },
    );
  });

  it('should test pay contribution and upload bankReceipt', async () => {
    jest.spyOn(contributionResolver.Mutation, 'addContribution');
    const results = await contributionResolver.Mutation.addContribution(
      null,
      {
        input: contributionInput,
        file,
      },
      { token: userToken.accessToken },
    );
    expect(results.dataValues).toHaveProperty('approved');
  });

  it('should test pay contribution without bank receipt', async () => {
    jest.spyOn(contributionResolver.Mutation, 'addContribution');
    const results = await contributionResolver.Mutation.addContribution(
      null,
      {
        input: contributionInput,
      },
      { token: userToken.accessToken },
    );
    expect(results.dataValues).toHaveProperty('approved');
  });

  it('should test fetch user Contribution', async () => {
    jest.spyOn(userResolver.User, 'userContributions');
    const results = await userResolver.User.userContributions(
      fetchedUser,
      null,
      { token: userToken.accessToken },
    );
    expect(results[0].dataValues.userId).toBe(1);
  });

  it('should throw an error when a someone in charge of approving tries to approve his or her contribution', async () => {
    try {
      jest.spyOn(contributionResolver.Mutation, 'approveContribution');
      await contributionResolver.Mutation.approveContribution(
        null,
        {
          id: 1,
        },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual('Sorry, you can not approve your own contribution!');
    }
  });
  it('should throw an error when someone who is not in charger tries to approve a contribution', async () => {
    try {
      jest.spyOn(contributionResolver.Mutation, 'approveContribution');
      await contributionResolver.Mutation.approveContribution(
        null,
        {
          id: 1,
        },
        { token: userTwoToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
      expect(err.message).toEqual('Sorry, you are neither a secretary nor fiance personnel.');
    }
  });
});


describe('eage cases', () => {
  const input = {
    email: 'example@example2.com',
    password: USER_PASSWORD,
  };
  beforeAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated', positionId: 3 } },
      { token: userToken.accessToken },
    );
    secretaryToken = await userResolver.Mutation.userLogin(null, { input }, { res });
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'disactivated', positionId: 1 } },
      { token: userToken.accessToken },
    );
  });

  it('should test approve contribution', async () => {
    jest.spyOn(contributionResolver.Mutation, 'approveContribution');
    const results = await contributionResolver.Mutation.approveContribution(
      null,
      {
        id: 1,
      },
      { token: secretaryToken.accessToken },
    );
    expect(results.approved).toBe(true);
  });
  it('should throw an error when a someone in charge of approving tries to approve a contribution which does not exist', async () => {
    try {
      jest.spyOn(contributionResolver.Mutation, 'approveContribution');
      await contributionResolver.Mutation.approveContribution(
        null,
        {
          id: 0,
        },
        { token: secretaryToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('Contribution not found!');
    }
  });
});
