import { Router } from 'express';
import {
  index,
  create,
  show,
  update,
  remove,
} from '../../controllers/v1/class.controller';

const router = Router();

router.get('index', index);
router.post('create', create);
router.get('show/:uuid', show);

export default router;
