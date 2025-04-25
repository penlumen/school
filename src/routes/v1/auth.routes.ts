import { Router } from 'express';
import {
  register,
  session,
  profile,
} from '../../controllers/v1/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/session', session);
router.get('/profile', profile);

export default router;
