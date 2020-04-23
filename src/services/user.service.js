import model from '../sequelize/models';

export class GetUsers {
  static async getAllUsers() {
    const users = await model.User.findAll();
    return users;
  }
}
