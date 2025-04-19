import { Router } from 'express';
import { session, profile } from '../../controllers/v1/auth.controller';

const router = Router();

router.post('/session', session);
router.get('/profile', profile);

export default router;
