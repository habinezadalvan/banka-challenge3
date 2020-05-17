import { Router } from 'express';
import { verifyMyAccount } from '../constrollers/verify.account';

const router = Router();

router.get('/verify/:token', verifyMyAccount);

export default router;
