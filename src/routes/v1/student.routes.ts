import { Router } from 'express';
import {
  create,
  index,
  remove,
  update,
} from '../../controllers/v1/student.controller';

const router = Router();

router.get('/student/index', index);
router.post('/student/create', create);
router.patch('/student/update/:uuid', update);
router.delete('/student/delete/:uuid', remove);

export default router;
