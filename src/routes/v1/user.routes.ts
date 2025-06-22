import { Router } from 'express';
import { index, create } from '../../controllers/v1/user.controller';

const router = Router();

router.get('/user/index', index);
router.post('/user/create', create);

export default router;
