import { Router } from 'express';
import {
  index,
  create,
  show,
  update,
  remove,
} from '../../controllers/v1/class.controller';

const router = Router();

router.get('/class/index', index);
router.post('/class/create', create);
router.get('/class/show/:uuid', show);

export default router;
