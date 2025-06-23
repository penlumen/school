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
router.patch('/class/update/:uuid', update);
router.delete('/class/delete/:uuid', remove);

export default router;
