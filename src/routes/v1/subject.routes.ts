import { Router } from 'express';
import { create, index, remove, show, update } from '../../controllers/v1/subject.controller';

const router = Router();

router.get('/subject/index/:class_uuid', index);
router.get('/subject/delete/:subject_uuid', show);
router.post('/subject/create/:class_uuid', create);
router.patch('/subject/update/:subject_uuid', update);
router.delete('/subject/delete/:subject_uuid', remove);

export default router;
