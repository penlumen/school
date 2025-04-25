import { Router } from 'express';
import {
  index,
  create,
  show,
  update,
  remove,
} from '../../controllers/v1/branch.controller';

const router = Router();

router.get('/branches', index);
router.post('/branch', create);
router.get('/branch/:uuid', show);
router.patch('/branch/:uuid', update);
router.delete('/branch/:uuid', remove);

export default router;
