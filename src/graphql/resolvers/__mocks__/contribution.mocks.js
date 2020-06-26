import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';

const filePath = path.resolve(
  __dirname,
  '../__mocks__/images/technology-in-digital-transformation-1440x1008-1024x717.jpg',
);

export const file = {
  filename: 'technology-in-digital-transformation-1440x1008-1024x717.jpg',
  mimetype: 'image/jpeg',
  encoding: '7bit',
  createReadStream: () => fs.createReadStream(filePath),
};

export const failingFile = {
  filename: '2-Days-Akagera-Nationall-Park-Tour (1).jpg',
  mimetype: 'image/jpeg',
  encoding: '7bit',
  createReadStream: new EventEmitter(),
};

export const contributionInput = {
  amount: 34000,
  contributionOfMonthOf: '2020-06-06 19:03:29.722+02',
};

export const contributionInputTwo = {
  amount: 33000,
  contributionOfMonthOf: '2020-06-06 19:03:29.722+02',
  paymentOption: 'mobile',
};

export const fetchedContribution = {
  id: 1,
  amount: '10000',
  approved: false,
  contributionOfMonthOf: '2020-06-24T07:33:31.382Z',
  paymentOption: 'bank',
  createdAt: '2020-06-24T07:33:31.382Z',
  updatedAt: '2020-06-24T07:33:41.142Z',
  userId: 1,
};
