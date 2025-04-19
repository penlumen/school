import { Router } from 'express';
import {
  index,
  create,
  show,
  update,
  remove,
} from '../../controllers/v1/school.controller';

const router = Router();

router.get('/school', index);
router.post('/school', create);
router.get('/school/:uuid', show);
router.patch('/school/:uuid', update);
router.delete('/school/:uuid', remove);

export default router;
