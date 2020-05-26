/* eslint-disable class-methods-use-this */
import { ApolloError } from 'apollo-server-express';
import { findRoleAndPosition } from '../utils/rolePositionSavings.utils';

export class Position {
  constructor(input) {
    this.name = input.name;
    this.description = input.description;
  }

  async findPosition(positionId) {
    const position = await findRoleAndPosition({ positionId });
    if (!position.firstResults && !position.secondResults) throw new ApolloError('Position not found!');
    return position.firstResults.dataValues;
  }
}
