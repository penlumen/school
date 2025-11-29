import { Router } from 'express';
import {
  show,
  index,
  create,
  remove,
  update,
} from '../../controllers/v1/student.controller';

const router = Router();

router.get('/student/index', index);
router.post('/student/create', create);
router.get('/student/show/:uuid', show);
router.patch('/student/update/:uuid', update);
router.delete('/student/delete/:uuid', remove);

export default router;
