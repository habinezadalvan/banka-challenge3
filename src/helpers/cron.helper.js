import cron from 'node-cron';
import { postDeadLineCharges } from '../utils/loan.utils';

export const updateInterest = (id) => cron.schedule('00 00 */28 * *', () => {
  postDeadLineCharges(id);
});
