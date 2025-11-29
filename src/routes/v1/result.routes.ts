import { Router } from 'express';
import {
  show,
  index,
  create,
  remove,
  update,
} from '../../controllers/v1/result.controller';

const router = Router();

router.get('/result/index', index);
router.get('/result/show/:student_uuid', show);
router.post('/result/create/:student_uuid', create);
router.patch('/result/update/:result_uuid', update);
router.delete('/result/delete/:result_uuid', remove);

export default router;
