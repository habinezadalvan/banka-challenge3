import { Router } from 'express';
import { verifyMyAccount } from '../constrollers/verify.account';
import { forgotPassword } from '../constrollers/forgot.password';

const router = Router();

router.get('/verify/:token', verifyMyAccount);
router.get('/reset/:token', forgotPassword);

export default router;
