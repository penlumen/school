import { Router } from 'express';
import { create, index } from '../../controllers/v1/student.controller';

const router = Router();

router.get('/student/index', index);
router.post('/student/create', create);

export default router;
