import { User } from '../../services/user.service';
import { Admin } from '../../services/admin.service';
import { decodeToken } from '../../helpers/user.helpers';
import { generalValidator } from '../../helpers/general.validator';
import {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  resetPasswordSchema,
  userUpdateProfileSchema,
} from '../../utils/schemas/user.schemas';
import { isAdmin, addTokenToResults } from '../../utils/user.utils';
import { Role } from '../../services/role.services';
import { Position } from '../../services/position.services';
import { Saving } from '../../services/saving.services';
import { Contribution } from '../../services/contribution.services';
import { Report } from '../../services/report.services';
import { Vote } from '../../services/vote.services';
import { VoteEvent } from '../../services/voteEvent.services';
import { Event } from '../../services/event.services';

export const userResolver = {
  Query: {
    users: async (_, { createdAt }, { token }) => {
      await decodeToken(token);
      const users = new User({});
      const fetchedUsers = await users.allUsers(createdAt);
      return fetchedUsers;
    },
    getUser: async (_, { id }, { token }) => {
      await decodeToken(token);
      const user = new User({});
      const fetchedUser = await user.getUser(id);
      return fetchedUser;
    },
    me: async (_, args, { token }) => {
      const meLoggedIn = await decodeToken(token);
      const meFunction = new User({});
      const myInfo = await meFunction.me(meLoggedIn);
      return myInfo;
    },
  },

  Mutation: {
    addUser: async (_, { input }, { token }) => {
      const loggedUser = await decodeToken(token);
      isAdmin(loggedUser);
      generalValidator(input, createUserSchema);
      const admin = new Admin(input);
      const user = await admin.createUser();
      return addTokenToResults(user);
    },

    userLogin: async (_, { input }, { res }) => {
      generalValidator(input, loginSchema);
      const loggingIn = new User(input);
      const accessToken = await loggingIn.login(res);
      return { accessToken };
    },
    updateUser: async (_, { id, input }, { token }) => {
      const loggedUser = await decodeToken(token);
      isAdmin(loggedUser);
      generalValidator(input, updateUserSchema);
      const adminInstance = new Admin(input);
      const updatedUser = await adminInstance.updateUser(id, input);
      return addTokenToResults(updatedUser);
    },
    deleteUser: async (_, { id }, { token }) => {
      const loggedInUser = await decodeToken(token);
      isAdmin(loggedInUser);
      const adminInstance = new Admin(id);
      return adminInstance.deleteUser(id);
    },
    forgotPassword: async (_, { email }) => {
      const user = new User(email);
      return user.forgotPassword(email);
    },
    resetPassword: async (_, { input }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await generalValidator(input, resetPasswordSchema);
      const user = new User({});
      return user.resetPassword(input, loggedInUser);
    },
    UpdateUserProfile: async (_, { input }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await generalValidator(input, userUpdateProfileSchema);
      const user = new User(input);
      return user.updateUserProfile(loggedInUser, input);
    },
    logout: (_, args, { req, res }) => new User({}).logout(req, res),
  },
  User: {
    userRole: async (user, _, { token }) => {
      await decodeToken(token);
      const role = new Role({});
      const res = await role.findRole(user.roleId);
      return res;
    },
    userPosition: async (user, _, { token }) => {
      await decodeToken(token);
      const position = new Position({});
      const res = await position.findPosition(user.positionId);
      return res;
    },
    userSavings: async (user, _, { token }) => {
      await decodeToken(token);
      const saving = new Saving({});
      const res = await saving.findSaving(user.dataValues.savingId);
      return res;
    },
    userContributions: async (user, _, { token }) => {
      await decodeToken(token);
      const contribution = new Contribution({});
      const res = await contribution.findContribution(user.id);
      return res;
    },
    userReports: async (user, _, { token }) => {
      await decodeToken(token);
      const report = new Report({});
      const res = await report.findReport(user.id);
      return res;
    },
    userVotes: async (user, _, { token }) => {
      await decodeToken(token);
      const vote = new Vote({});
      const res = await vote.findVote(user.id);
      return res;
    },
    userVotingEvents: async (user, _, { token }) => {
      await decodeToken(token);
      const voteEvent = new VoteEvent({});
      const res = await voteEvent.findVoteEvent(user.id);
      return res;
    },
    userEvents: async (user, _, { token }) => {
      await decodeToken(token);
      const event = new Event({});
      const res = await event.findEvent(user.id);
      return res;
    },
  },
};
