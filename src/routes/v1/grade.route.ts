import { Router } from 'express';
import { create, index } from '../../controllers/v1/grade.controller';

const router = Router();

router.get('/grade/index', index);
router.post('/grade/create', create);

export default router;
