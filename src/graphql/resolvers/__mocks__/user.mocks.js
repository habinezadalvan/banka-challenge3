import 'dotenv/config';

const { USER_PASSWORD } = process.env;

export const loginData = {
  email: 'example@example.com',
  password: USER_PASSWORD,
};

export const loginDataTwo = {
  email: 'example@example2.com',
  password: USER_PASSWORD,
};

export const user = {
  firstName: 'christian2',
  lastName: 'habineza2',
  userName: 'habinezadalvan',
  email: 'habineza@gmail.com',
  password: 'TESTpassword123!@#',
  phoneNo: '+25030393944',
  avatar: 'image',
  roleId: 1,
};
export const userTwo = {
  firstName: 'christian2',
  lastName: 'habineza2',
  userName: 'habinezadalvan2',
  email: 'habineza2',
  password: 'TESTpassword123!@#',
  phoneNo: '+25030393944',
  avatar: 'image',
  roleId: 1,
};
