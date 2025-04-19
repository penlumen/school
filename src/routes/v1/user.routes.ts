import { Router } from 'express';
import { create } from '../../controllers/v1/user.controller';

const router = Router();

router.post('/create', create);

export default router;
