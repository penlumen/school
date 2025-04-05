import { Router } from 'express';
import {
  getSchool,
  showSchool,
  createSchool,
  updateSchool,
  deleteSchool,
} from '../../controllers/v1/school.controller';

const router = Router();

router.get('/school', getSchool);
router.post('/school', createSchool);
router.get('/school/:uuid', showSchool);
router.patch('/school/:uuid', updateSchool);
router.delete('/school/:uuid', deleteSchool);

export default router;
