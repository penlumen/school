import { Router } from 'express';
import {
  index,
  create,
  show,
  update,
  remove,
} from '../../controllers/v1/branch.controller';

const router = Router();

router.get('/branch/index', index);
router.post('/branch/create', create);
router.get('/branch/show/:uuid', show);
router.patch('/branch/update/:uuid', update);
router.delete('/branch/remove/:uuid', remove);

export default router;
