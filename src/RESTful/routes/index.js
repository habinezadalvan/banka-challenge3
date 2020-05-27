import { Router } from 'express';
import { verifyMyAccount } from '../constrollers/verify.account';
import { forgotPassword } from '../constrollers/forgot.password';
import { refreshToken } from '../constrollers/refresh.token';

const router = Router();

router.get('/verify/:token', verifyMyAccount);
router.get('/reset/:token', forgotPassword);
router.post('/refresh_token', refreshToken);

export default router;
