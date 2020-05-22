import models from '../sequelize/models';

export const findRoleAndPosition = async (values) => {
  const arr = [];
  Object.keys(values).map(async (value) => {
    const modelName = `${value[0].toLocaleUpperCase().concat(value.substr(1, value.length - 3))}`;
    if (values[value] !== undefined) {
      const result = models[`${modelName}`].findOne({ where: { id: values[value] || null } });
      arr.push(result);
    }
  });
  const [role, position] = await Promise.all(arr);
  return {
    role,
    position,
  };
};
