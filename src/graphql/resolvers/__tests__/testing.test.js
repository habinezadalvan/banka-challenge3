import dbConnection from '../../../db/connectDb';
import userResolver from '../user.resolver';


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
});
