import 'dotenv/config';

const { USER_PASSWORD } = process.env;

export const loginData = {
  email: 'example@example.com',
  password: USER_PASSWORD,
};

export const user = {
  firstName: 'christian2',
  lastName: 'habineza2',
  userName: 'habinezadalvan',
  email: 'habineza@gmail.com',
  password: 'hashedpassword',
  phoneNo: '+25030393944',
  avatar: 'image',
  roleId: 1,
  positionId: 1,
  userPositionStatusId: 1,
  savingsId: 1,
};
