import { Router } from 'express';
import { create, index, remove, update } from '../../controllers/v1/grade.controller';

const router = Router();

router.get('/grade/index', index);
router.post('/grade/create', create);
router.patch('/grade/update/:uuid', update);
router.delete('/grade/delete/:uuid', remove);

export default router;
