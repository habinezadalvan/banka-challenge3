/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';

export class Event {
  constructor(input) {
    this.votingMembers = input.votingMembers;
    this.candidates = input.candidates;
  }

  async findEvent(id) {
    const userEvents = await models.Event.findAll({ where: { userId: id } });
    // if (!userEvents) return null;
    return userEvents;
  }
}
