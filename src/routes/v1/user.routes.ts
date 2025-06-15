import { Router } from 'express';
import { index } from '../../controllers/v1/user.controller';

const router = Router();

router.get('/user/index', index);

export default router;
