import { Router } from 'express';
import {
  create,
  index,
  remove,
  update,
} from '../../controllers/v1/calendar.controller';

const router = Router();

router.get('/calendar/index', index);
router.post('/calendar/create', create);
router.patch('/calendar/update/:uuid', update);
router.delete('/calendar/delete/:uuid', remove);

export default router;
