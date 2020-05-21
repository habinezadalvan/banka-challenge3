import 'dotenv/config';

const { USER_PASSWORD, USER_NEW_PASSWORD } = process.env;

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

export const fetchedUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  userName: 'johndoe',
  email: 'example@example.com',
  password: 'password',
  phoneNo: '+230494484475',
  avatar: 'image',
  accountStatus: 'activated',
  positionStatus: 'active',
  verified: true,
  createdAt: '2020-05-20T15:08:14.691Z',
  updatedAt: '2020-05-20T15:08:14.691Z',
  positionId: 1,
  roleId: 1,
};

export const resetPasswordInput = {
  oldPassword: USER_PASSWORD,
  newPassword: USER_NEW_PASSWORD,
  comparePassword: USER_NEW_PASSWORD,
};
