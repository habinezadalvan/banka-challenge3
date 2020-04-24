import dbConnection from '../../../db/connectDb';
import { userResolver } from '../user.resolver';

const user = {
  firstName: 'christian2',
  lastName: 'habineza2',
  userName: 'habinezadalvan',
  email: 'habineza@gmail.com',
  password: 'hashedpassword',
  avatar: 'image',
};
describe('My Test Suite', () => {
  beforeAll(async () => {
    await dbConnection;
  });
  afterAll((done) => {
    dbConnection.close();
    done();
  });

  it('My Test Case', async () => {
    jest.spyOn(userResolver.Query, 'users');
    const res = await userResolver.Query.users();
    expect(res[0].id).toEqual(1);
  });
  it('My Test Case2', async () => {
    jest.spyOn(userResolver.Mutation, 'addUser');
    const res = await userResolver.Mutation.addUser(null, user);
    expect(res.dataValues.firstName).toEqual('christian2');
  });
});
