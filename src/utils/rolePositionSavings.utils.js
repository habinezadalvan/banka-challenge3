import models from '../sequelize/models';

export const findRoleAndPosition = async (values) => {
  const arr = [];
  Object.keys(values).map(async (value) => {
    const modelName = `${value[0].toLocaleUpperCase().concat(value.substr(1, value.length - 3))}`;
    if (values[value] !== undefined) {
      const result = models[`${modelName}`].findOne({ where: { id: values[value] } });
      arr.push(result);
    }
  });
  const [firstResults, secondResults] = await Promise.all(arr);
  return {
    firstResults,
    secondResults,
  };
};
