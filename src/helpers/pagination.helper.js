import { Op } from 'sequelize';

export const cursorBasedPagination = (createdAt) => {
  const option = { order: [['createdAt', 'DESC']], where: {} };
  if (createdAt) {
    option.where.createdAt = {
      [Op.lt]: new Date(Number(createdAt)),
    };
  }
  return option;
};
