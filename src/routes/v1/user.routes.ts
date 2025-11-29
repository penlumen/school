import { Router } from 'express';
import {
  show,
  index,
  create,
  update,
  remove,
} from '../../controllers/v1/user.controller';

const router = Router();

router.get('/user/index', index);
router.post('/user/create', create);
router.get('/user/show/:uuid', show);
router.patch('/user/update/:uuid', update);
router.delete('/user/delete/:uuid', remove);

export default router;
