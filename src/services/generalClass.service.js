/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';

export class GeneralClass {
  constructor(input) {
    // contribution input
    this.amount = input.amount; // works for savings and loan as well
    this.paymentOption = input.paymentOption;
    this.contributionOfMonthOf = input.contributionOfMonthOf;

    // event and voteEvent input

    this.votingMembers = input.votingMembers;
    this.candidates = input.candidates;

    // position and role input

    this.name = input.name;
    this.description = input.description;

    // report input
    this.title = input.title;
    this.type = input.type;
    this.content = input.content;

    // vote input

    this.positionId = input.positionId;
    this.userId = input.userId;

    // laon input
    this.paymentDeadLine = input.paymentDeadLine;
  }

  async findGeneralMethod(id, modelName) {
    const results = await models[`${modelName}`].findAll({ where: { userId: id } });
    return results;
  }
}
