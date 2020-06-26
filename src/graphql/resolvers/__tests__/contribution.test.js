import 'dotenv/config';
import { userResolver } from '../user.resolver';
import { contributionResolver } from '../contribution.resolver';
import {
  fetchedUser, loginData, loginDataTwo, loginDataFour,
} from '../__mocks__/user.mocks';
import { res } from '../__mocks__/request.response.mocks';
import {
  file, contributionInputTwo, fetchedContribution, contributionInput,
} from '../__mocks__/contribution.mocks';

const { USER_PASSWORD } = process.env;

let userToken;

let secretaryToken;

let userTwoToken;

let userFourToken;

const createdAt = new Date(Date.now()).getTime();

let contribution;

describe('Contribution Test Suite', () => {
  const updateContributionInput = {
    amount: 10000,
  };

  beforeAll(async () => {
    userToken = await userResolver.Mutation.userLogin(null, { input: loginData }, { res });
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated' } },
      { token: userToken.accessToken },
    );
    userTwoToken = await userResolver.Mutation.userLogin(
      null,
      { input: loginDataTwo },
      { res },
    );
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'disactivated' } },
      { token: userToken.accessToken },
    );
  });

  // create or pay contribution

  it('should test pay contribution via mobile money', async () => {
    jest.spyOn(contributionResolver.Mutation, 'addContribution');
    const results = await contributionResolver.Mutation.addContribution(
      null,
      {
        input: contributionInputTwo,
      },
      { token: userToken.accessToken },
    );
    expect(results.dataValues).toHaveProperty('approved');
  });

  it('should test pay contribution via bank', async () => {
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

  it('should upload and get bankReceipt', async () => {
    jest.spyOn(contributionResolver.Contribution, 'bankReceipt');
    const results = await contributionResolver.Contribution.bankReceipt(
      fetchedContribution, null,
      { token: userToken.accessToken },
    );
    expect(results).toBe(null);
  });

  it('should throw an error when trying to pay contribution with bank option without providing the receipt', async () => {
    try {
      jest.spyOn(contributionResolver.Mutation, 'addContribution');
      await contributionResolver.Mutation.addContribution(
        null,
        {
          input: {
            amount: 50000,
            contributionOfMonthOf: '2020-06-06 19:03:29.722+02',
            paymentOption: 'bank',
          },
        },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Please upload your bank receicpt');
    }
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

  // // approve contribution

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
      expect(err.message).toEqual(
        'Sorry, you can not approve your own contribution!',
      );
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
      expect(err.message).toEqual(
        'Sorry, you are neither a secretary nor fiance personnel.',
      );
    }
  });

  // // update contribution
  it('should test update contribution by user', async () => {
    jest.spyOn(contributionResolver.Mutation, 'updateContribution');
    const results = await contributionResolver.Mutation.updateContribution(
      null,
      {
        id: 1,
        input: updateContributionInput,
        file,
      },
      { token: userToken.accessToken },
    );
    expect(results.amount).toEqual('10000');
  });
  it('should throw an error when trying to update a contribution which does not exists', async () => {
    try {
      jest.spyOn(contributionResolver.Mutation, 'updateContribution');
      await contributionResolver.Mutation.updateContribution(
        null,
        {
          id: 0,
          input: updateContributionInput,
        },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ApolloError');
      expect(err.message).toEqual('Contribution not found!');
    }
  });
  it('should throw an error when a user tries to update a contribution which does not belong to him/her', async () => {
    try {
      jest.spyOn(contributionResolver.Mutation, 'updateContribution');
      await contributionResolver.Mutation.updateContribution(
        null,
        {
          id: 2,
          input: updateContributionInput,
        },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('ForbiddenError');
      expect(err.message).toEqual(
        'Sorry, this contribution does not belong to you!',
      );
    }
  });

  // // fetch contributions

  it('should fetch a single contribution', async () => {
    jest.spyOn(contributionResolver.Query, 'getContribution');
    contribution = await contributionResolver.Query.getContribution(
      null,
      {
        id: 1,
      },
      { token: userToken.accessToken },
    );
    expect(contribution.amount).toEqual('10000');
  });
  it('should throw an error when the contribution does not exist', async () => {
    try {
      jest.spyOn(contributionResolver.Query, 'getContribution');
      contribution = await contributionResolver.Query.getContribution(
        null,
        {
          id: 0,
        },
        { token: userToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Contribution not found!');
    }
  });
  it('should fetch all contributions', async () => {
    jest.spyOn(contributionResolver.Query, 'contributions');
    const results = await contributionResolver.Query.contributions(
      null,
      {
        createdAt,
      },
      { token: userToken.accessToken },
    );
    expect(results[0].dataValues).toHaveProperty('approved');
  });

  it('should fetch contribution owner', async () => {
    jest.spyOn(contributionResolver.Contribution, 'owner');
    const results = await contributionResolver.Contribution.owner(
      contribution,
      null,
      { token: userToken.accessToken },
    );
    expect(results.dataValues).toHaveProperty('firstName');
  });
});

describe('Approve contribution', () => {
  const secretaryInput = {
    email: 'example@example2.com',
    password: USER_PASSWORD,
  };
  beforeAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'activated', positionId: 3 } },
      { token: userToken.accessToken },
    );
    secretaryToken = await userResolver.Mutation.userLogin(
      null,
      { input: secretaryInput },
      { res },
    );
    userFourToken = await userResolver.Mutation.userLogin(
      null,
      { input: loginDataFour },
      { res },
    );
  });

  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      { id: 2, input: { accountStatus: 'disactivated', positionId: 1 } },
      { token: userToken.accessToken },
    );
  });

  it('should test approve contribution of userOne', async () => {
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

  it('should test the case where the contribution is already approved', async () => {
    jest.spyOn(contributionResolver.Mutation, 'approveContribution');
    const results = await contributionResolver.Mutation.approveContribution(
      null,
      {
        id: 1,
      },
      { token: secretaryToken.accessToken },
    );
    expect(results.approved).toBe(false);
  });

  it('should approves the contribution in case where the user has a contribution but without savingId', async () => {
    jest.spyOn(contributionResolver.Mutation, 'approveContribution');
    const results = await contributionResolver.Mutation.approveContribution(
      null,
      {
        id: 2,
      },
      { token: userToken.accessToken },
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


  it('should test pay contribution via bank by userFour', async () => {
    jest.spyOn(contributionResolver.Mutation, 'addContribution');
    const results = await contributionResolver.Mutation.addContribution(
      null,
      {
        input: contributionInput,
        file,
      },
      { token: userFourToken.accessToken },
    );
    expect(results.dataValues).toHaveProperty('approved');
  });
  it('should test approve contribution of userFour', async () => {
    jest.spyOn(contributionResolver.Mutation, 'approveContribution');
    const results = await contributionResolver.Mutation.approveContribution(
      null,
      {
        id: 6,
      },
      { token: secretaryToken.accessToken },
    );
    expect(results.approved).toBe(true);
  });

  it('should throw an error when userFour tries to update a contribution when it has been already approved', async () => {
    try {
      jest.spyOn(contributionResolver.Mutation, 'updateContribution');
      await contributionResolver.Mutation.updateContribution(
        null,
        {
          id: 6,
          file,
        },
        { token: userFourToken.accessToken },
      );
    } catch (err) {
      expect(err.message).toEqual('Sorry, you can not update this contribution. It has been approved');
    }
  });
});

// // inactive secretary

describe('inactive secretary', () => {
  beforeAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      {
        id: 2,
        input: {
          positionStatus: 'inactive',
          roleId: 1,
          positionId: 3,
          accountStatus: 'activated',
        },
      },
      { token: userToken.accessToken },
    );
    secretaryToken = await userResolver.Mutation.userLogin(
      null,
      { input: loginDataTwo },
      { res },
    );
  });
  afterAll(async () => {
    await userResolver.Mutation.updateUser(
      null,
      {
        id: 2,
        input: {
          positionStatus: 'active',
          roleId: 2,
          positionId: 1,
          accountStatus: 'disactivated',
        },
      },
      { token: userToken.accessToken },
    );
  });

  it('should throw an error when a someone in charge of approving tries to approve a contribution when his or her position status is inactive', async () => {
    try {
      jest.spyOn(contributionResolver.Mutation, 'approveContribution');
      await contributionResolver.Mutation.approveContribution(
        null,
        {
          id: 1,
        },
        { token: secretaryToken.accessToken },
      );
    } catch (err) {
      expect(err.constructor.name).toEqual('AuthenticationError');
      expect(err.message).toEqual('Sorry, your position is no longer active.');
    }
  });
});
