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

export const loginDataThree = {
  email: 'example@example3.com',
  password: USER_PASSWORD,
};

export const user = {
  firstName: 'firstname',
  lastName: 'lastname',
  userName: 'username',
  email: 'email@gmail.com',
  password: 'TESTpassword123!@#',
  phoneNo: '+25030393944',
  avatar: 'image',
  roleId: 1,
};
export const userTwo = {
  firstName: 'firstname2',
  lastName: 'lastname2',
  userName: 'username2',
  email: 'email2gmail.com',
  password: 'TESTpassword123!@#',
  phoneNo: '+25030393944',
  avatar: 'image',
  roleId: 1,
};
export const updateUserEmail = {
  email: 'userEmailUpdated@gmail.com',
};
