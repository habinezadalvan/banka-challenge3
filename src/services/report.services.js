/* eslint-disable class-methods-use-this */
import models from '../sequelize/models';

export class Report {
  constructor(input) {
    this.title = input.title;
    this.type = input.type;
    this.content = input.content;
  }

  async findReport(id) {
    const userReports = await models.Report.findAll({ where: { userId: id } });
    // if (!userReports) return null;
    return userReports;
  }
}
