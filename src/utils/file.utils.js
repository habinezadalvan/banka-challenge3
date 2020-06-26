import { Op } from 'sequelize';
import models from '../sequelize/models';


export const findFiles = async ({
  reportId, eventId, loanId, assetId,
}) => {
  const file = await models.File.findAll({
    where: {
      [Op.or]: [
        { reportId: { [Op.eq]: reportId } },
        { eventId: { [Op.eq]: eventId } },
        { loanId: { [Op.eq]: loanId } },
        { assetId: { [Op.eq]: assetId } },
      ],
    },
    raw: true,
  });

  return file;
};

export const findFile = async ({ userId, contributionId }) => {
  const file = await models.File.findOne({
    where: {
      [Op.or]: {
        userId: { [Op.eq]: userId },
        contributionId: { [Op.eq]: contributionId },
      },
    },
    raw: true,
  });
  return file;
};
