/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';

export class VoteEvent {
  constructor(input) {
    this.votingMembers = input.votingMembers;
    this.candidates = input.candidates;
  }

  async findVoteEvent(id) {
    const userVoteEvents = await models.VoteEvent.findAll({ where: { userId: id } });
    // if (!userVoteEvents) return null;
    return userVoteEvents;
  }
}
