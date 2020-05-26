/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';

export class Vote {
  constructor(input) {
    this.positionId = input.positionId;
    this.candidateId = input.candidateId;
  }

  async findVote(id) {
    const userVotes = await models.Vote.findAll({ where: { candidateId: id } });
    // if (!userVotes) return null;
    return userVotes;
  }
}
